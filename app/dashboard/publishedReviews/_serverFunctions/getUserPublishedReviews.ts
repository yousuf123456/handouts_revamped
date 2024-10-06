import prisma from "@/app/_libs/prismadb";
import { PaginationParams } from "@/app/_types";
import { calculateItemsToSkip } from "@/app/_utils";
import { mapMongoToPrisma } from "@/app/_utils/formatingUtils";
import { USER_REVIEWS_PER_PAGE } from "@/app/_config/pagination";
import { RatingAndReview, RatingAndReviewBucket } from "@prisma/client";

type getUserPublishedReviewsParams = PaginationParams & {
  dbUserId: string;
};

// Main function to get published reviews by a user
export const getUserPublishedReviews = async ({
  page,
  dbUserId,
}: getUserPublishedReviewsParams) => {
  const reviewedProductsInfo = await getReviewedProductsInfo(dbUserId);

  const itemsToSkip = calculateItemsToSkip(page || 1, USER_REVIEWS_PER_PAGE);

  const { publishedReviews, totalCount } = await fetchUserReviews(
    reviewedProductsInfo,
    dbUserId,
    itemsToSkip,
  );

  return { publishedReviews: mapMongoToPrisma(publishedReviews), totalCount };
};

// Helper function to get information on reviewed products
const getReviewedProductsInfo = async (dbUserId: string) => {
  const reviewedOrderedProducts = await prisma.orderedProduct.findMany({
    where: {
      //   hasBeenReviewed: true,
      //   status: "Delievered",
      customerId: dbUserId,
    },
    select: {
      createdAt: true,
      product: true,
    },
  });

  // Map product info to only contain purchased date and productId
  return reviewedOrderedProducts.map((orderedProduct) => ({
    id: orderedProduct.product.id,
    purchasedAt: orderedProduct.createdAt,
  }));
};

// Helper function to fetch user reviews from the database
const fetchUserReviews = async (
  reviewedProductsInfo: { id: string; purchasedAt: Date }[],
  dbUserId: string,
  itemsToSkip: number,
) => {
  const reviewedProductsObjectIds = reviewedProductsInfo.map((productInfo) => ({
    $oid: productInfo.id,
  }));

  const pipeline = createPipeline(
    reviewedProductsObjectIds,
    dbUserId,
    itemsToSkip,
  );

  const publishedReviewsData = (await prisma.ratingAndReviewBucket.aggregateRaw(
    {
      pipeline,
    },
  )) as unknown as {
    count: { total: number };
    buckets: (Omit<RatingAndReviewBucket, "ratingAndReviews"> & {
      ratingAndReviews: RatingAndReview;
    })[]; //'ratingAndReviews' field contains single ratingAndReview as we unwinded the 'ratingAndReviews' array;
  }[];

  if (publishedReviewsData.length === 0)
    return {
      publishedReviews: [],
      totalCount: 0,
    };

  // Getting the total count of the user published reviews
  const totalCount = publishedReviewsData[0].count.total;

  // Spreading the unwinded ratingAndReviews field which contains a single ratingAndReview along with productInformation from bucket
  const publishedReviews = publishedReviewsData[0].buckets.map((review) => ({
    productInformation: review.productInformation,
    ...review.ratingAndReviews,
  }));

  return { publishedReviews, totalCount };
};

// Helper function to create MongoDB aggregation pipeline to get reviews buckets
const createPipeline = (
  reviewedProductsObjectIds: { $oid: string }[],
  dbUserId: string,
  itemsToSkip: number,
) => [
  {
    $match: {
      $expr: {
        $in: ["$productId", reviewedProductsObjectIds],
      },
    },
  },
  {
    $unwind: "$ratingAndReviews",
  },
  {
    $match: {
      "ratingAndReviews.userId": { $oid: dbUserId },
    },
  },
  {
    $facet: {
      count: [{ $count: "total" }],
      buckets: [
        { $sort: { _id: -1 } },
        { $skip: itemsToSkip },
        { $limit: USER_REVIEWS_PER_PAGE },
      ],
    },
  },
  { $unwind: "$count" },
  {
    $project: {
      "buckets._id": 1,
      "buckets.ratingAndReviews": 1,
      count: 1,
    },
  },
];
