import prisma from "../../_libs/prismadb";
import { mapMongoToPrisma } from "../../_utils/formatingUtils";

import { Product } from "@prisma/client";
import { AtlasSearchPaginationParams } from "../../_types";
import { ProductCardProps } from "../../_components/ProductCard";
import { SEARCH_PRODUCTS_PER_PAGE } from "../../_config/pagination";

// Type definitions
type SearchProductsParams = Partial<AtlasSearchPaginationParams> & {
  category: string;
  query: string | undefined;
  storeId: string | undefined;
};

type ProjectStage = {
  [K in keyof ProductCardProps["product"]]: any;
};

type SearchedProduct = {
  [K in keyof ProjectStage]: K extends keyof Product ? Product[K] : never;
} & {
  id: string;
  count: number;
  paginationToken: string;
};

// Constants
const DESCRIPTION_BOOST = 1;

const createBasePipeline = (params: SearchProductsParams) => {
  const { query, storeId, category, pageDirection, paginationToken } = params;

  const hasToPaginateResults = pageDirection && paginationToken;

  //TS does not recognize the deep structure of atlas search pipeline
  const compoundSearchOperator: {
    [key: string]: {
      [key: string]: any;
    }[];
  } = {
    must: [],
    should: [],
  };

  // Search in only specific store products
  if (storeId)
    compoundSearchOperator.must.push({
      equals: {
        value: { $oid: storeId },
        path: "storeId",
      },
    });

  // Search in sepcific category of products
  if (category !== "search") {
    compoundSearchOperator.must.push({
      embeddedDocument: {
        path: "categoryTreeData",
        operator: {
          compound: {
            must: [
              {
                text: {
                  path: "categoryTreeData.name",
                  query: category,
                },
              },
            ],
          },
        },
      },
    });
  }

  // Search products for the given query
  if (query) {
    compoundSearchOperator.must.push({
      text: {
        query,
        path: "name",
        fuzzy: { maxEdits: 1 },
      },
    });

    // Boost the products up in ranking whose description mathches with their name
    compoundSearchOperator.should.push({
      text: {
        query,
        path: "description",
        score: { boost: { value: DESCRIPTION_BOOST } },
      },
    });
  }

  const projectStage: ProjectStage = {
    id: 1,
    name: 1,
    image: 1,
    price: 1,
    avgRating: 1,
    attributes: 1,
    detailedImages: 1,
    categoryTreeData: 1,
    superTokensUserId: 1,
    count: "$$SEARCH_META.count.lowerBound",
    scoreDetails: { $meta: "searchScoreDetails" },
    paginationToken: { $meta: "searchSequenceToken" },
  };

  return [
    {
      $search: {
        index: "productsSearch",
        compound: compoundSearchOperator,
        count: { type: "lowerBound" },
        scoreDetails: true,
        sort: {
          score: { $meta: "searchScore" },
          _id: -1,
        },
        ...(hasToPaginateResults
          ? {
              [pageDirection === "next" ? "searchAfter" : "searchBefore"]:
                paginationToken,
            }
          : {}),
      },
    },
    { $limit: SEARCH_PRODUCTS_PER_PAGE },
    {
      $project: projectStage,
    },
  ];
};

const createSearchFilters = (params: SearchProductsParams): any[] => {
  const searchFilters: any[] = [];

  if (params.filters) {
    params.filters.split("|").forEach((filter) => {
      const [field, value] = filter.split("-");

      if (field === "price") {
        const [min, max] = value.split(",").map(Number);
        searchFilters.push({
          range: { path: field, gte: min, lte: max },
        });
      } else if (field === "avgRating") {
        searchFilters.push({
          range: { path: field, gte: Number(value) },
        });
      } else {
        searchFilters.push({
          text: { path: field, query: value.split(",") },
        });
      }
    });
  }

  return searchFilters;
};

export const searchProducts = async (params: SearchProductsParams) => {
  const pipeline = createBasePipeline(params);
  const searchFilters = createSearchFilters(params);

  if (searchFilters.length > 0) {
    // @ts-ignore: TS doesn't recognize the deep structure of pipeline
    pipeline[0].$search.compound.filter = searchFilters;
  }

  const searchedProducts = (await prisma.product.aggregateRaw({
    pipeline: pipeline as any,
  })) as unknown as SearchedProduct[];

  if (
    params.pageDirection &&
    params.paginationToken &&
    params.pageDirection === "prev"
  ) {
    // Normally mongodb results are in reverse order when using searchBefore operator
    return mapMongoToPrisma(searchedProducts).reverse();
  } else return mapMongoToPrisma(searchedProducts);
};
