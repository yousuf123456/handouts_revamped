import prisma from "../_libs/prismadb";

import { Product } from "@prisma/client";
import { PipelineStage } from "mongoose";
import { AtlasSearchPaginationParams, ProductAttributes } from "../_types";
import { mapMongoToPrisma } from "../_utils/formatingUtils";
import { ProductCardProps } from "../_components/ProductCard";
import { MATCHING_PRODUCTS_PER_PAGE } from "../_config/pagination";
import { fakeDelay } from "../dashboard/orders/_components/UserOrders";

type ProjectStage = {
  [K in keyof ProductCardProps["product"]]: any;
};

type MatchedProduct = {
  [K in keyof ProjectStage]: K extends keyof Product ? Product[K] : never;
} & {
  id: string;
  count: number;
  paginationToken: string;
};

type Parameters = Partial<AtlasSearchPaginationParams> & {
  productsToMatch: (Pick<
    Product,
    "name" | "attributes" | "categoryTreeData" | "id"
  > & {
    attributes: ProductAttributes;
  })[];
};

export const getMatchingProducts = async (params: Parameters) => {
  const { productsToMatch, paginationToken, pageDirection } = params;

  const hasToPaginateResults = paginationToken && pageDirection;

  const productsToMatchMongoIds = productsToMatch.map((productToMatch) => ({
    $oid: productToMatch.id,
  }));

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
    paginationToken: { $meta: "searchSequenceToken" },
  };

  const pipeline: PipelineStage[] = [
    {
      $search: {
        index: "productsSearch",
        compound: {
          must: [
            {
              moreLikeThis: {
                like: productsToMatch.map(
                  ({ id, ...restFields }) => restFields,
                ),
              },
            },
          ],
          mustNot: [
            {
              in: {
                path: "_id",
                value: productsToMatchMongoIds,
              },
            },
          ],
        },
        count: {
          type: "lowerBound",
        },
        sort: {
          score: { $meta: "searchScore" },
          createdAt: -1,
        },
        ...(hasToPaginateResults
          ? {
              [pageDirection === "next" ? "searchAfter" : "searchBefore"]:
                paginationToken,
            }
          : {}),
      },
    },
    {
      $limit: MATCHING_PRODUCTS_PER_PAGE,
    },
    {
      $project: projectStage,
    },
  ];

  const matchingProducts = (await prisma.product.aggregateRaw({
    pipeline: pipeline as any,
  })) as unknown as MatchedProduct[];

  if (hasToPaginateResults && pageDirection === "prev") {
    // Normally mongodb results are in reverse order when using searchBefore operator
    return mapMongoToPrisma(matchingProducts).reverse();
  } else return mapMongoToPrisma(matchingProducts);
};
