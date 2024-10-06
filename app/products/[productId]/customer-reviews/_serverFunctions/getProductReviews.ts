import prisma from "../../../../_libs/prismadb";

import { PaginationParams, SortStringType } from "../../../../_types/index";

import {
  PRODUCTS_REVIEWS_PER_PAGE,
  RATING_AND_REVIEWS_PER_BUCKET_COUNT,
} from "@/app/_config/pagination";

import { PipelineStage } from "mongoose";
import { RatingAndReview } from "@prisma/client";
import { mapMongoToPrisma } from "@/app/_utils/formatingUtils";
import { getPaginatedBucketPipeline } from "../../_utils/getPaginatedBucketPipeline";

type Parameters = Partial<PaginationParams> & {
  productId?: string;
  storeId: string | undefined;
  getWholeStoreProductsReviews?: boolean;
};

export const getProductReviews = async (parameters: Parameters) => {
  const {
    page,
    sort,
    filter,
    storeId,
    productId,
    getWholeStoreProductsReviews,
  } = parameters;

  if (!storeId && getWholeStoreProductsReviews) return [];
  if (!productId && !getWholeStoreProductsReviews) return [];

  let pipeline: PipelineStage[] = [
    {
      $match: {
        storeId: { $oid: storeId },
        ...(!getWholeStoreProductsReviews && {
          productId: { $oid: productId },
        }),
      },
    },
  ];

  const paginatedPipeline = getPaginatedBucketPipeline(
    structuredClone(pipeline),
    {
      sort,
      page,
      filterField: filter?.split("-")[0],
      itemsFieldName: "ratingAndReviews",
      ITEMS_PER_PAGE: PRODUCTS_REVIEWS_PER_PAGE,
      ITEMS_PER_BUCKET_COUNT: RATING_AND_REVIEWS_PER_BUCKET_COUNT,
      filterValue: parseInt(filter?.split("-")[1] || "5"), // Convert the rating value to number
    },
  );

  const reviewsBucketsArray = (await prisma.ratingAndReviewBucket.aggregateRaw({
    pipeline: paginatedPipeline as any[],
  })) as unknown as any[];

  // Extracting ratingsAndReviews from buckets
  const reviews = reviewsBucketsArray?.flatMap(
    (productReviewBucket: any) =>
      Array.isArray(productReviewBucket.ratingAndReviews) // Check to see if the items array was unwinded
        ? productReviewBucket.ratingAndReviews // Return items array if it was not unwinded if
        : [productReviewBucket.ratingAndReviews], // Return an array of the individual unwinded item
  );

  return mapMongoToPrisma(reviews) as RatingAndReview[]; // Return reviews with mongodb fields mapped to prisma type fields
};
