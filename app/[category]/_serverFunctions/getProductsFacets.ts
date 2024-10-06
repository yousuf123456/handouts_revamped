import prisma from "../../_libs/prismadb";
import { PipelineStage } from "mongoose";

const DESCRIPTION_BOOST = 1;

export type ProductFacets = {
  [key: string]: {
    buckets: { _id: string; count: number }[];
  };
};

type GetProductsFacetsParams = {
  category: string;
  query: string | undefined;
  storeId: string | undefined;
};

const createSearchStage = ({
  query,
  category,
  storeId,
}: GetProductsFacetsParams): PipelineStage => {
  // const path = isNameSearch ? "name" : "categoryTreeData.name";

  //Ts does not recognize the deep structure of atlas search pipeline
  const baseOperator: { [key: string]: any } = {
    compound: {
      must: [],
      should: [],
    },
  };

  // Search in only specific store products
  if (storeId)
    baseOperator.compound.must.push({
      equals: {
        value: { $oid: storeId },
        path: "storeId",
      },
    });

  // Search in sepcific category of products
  if (category !== "search") {
    baseOperator.compound.must.push({
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
    baseOperator.compound.must.push({
      text: {
        query,
        path: "name",
        fuzzy: { maxEdits: 1 },
      },
    });
  }

  return {
    // @ts-ignore Because the Mongoose type isn't updated
    $searchMeta: {
      index: "productsSearch",
      facet: {
        operator: baseOperator,
        facets: {
          "attributes.colors": { type: "string", path: "attributes.colors" },
          "attributes.brand": { type: "string", path: "attributes.brand" },
          "attributes.sizes": { type: "string", path: "attributes.sizes" },
          category: { type: "string", path: "category" },
        },
      },
    },
  };
};

export const getProductsFacets = async (params: GetProductsFacetsParams) => {
  const pipeline: PipelineStage[] = [createSearchStage(params)];

  return prisma.product.aggregateRaw({
    pipeline: pipeline as any[],
  }) as unknown as { count: number; facet: ProductFacets }[];
};
