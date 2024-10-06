"use server";

import prisma from "@/app/_libs/prismadb";
import { ActionResult } from "@/app/_types";
import { currentUser } from "@clerk/nextjs/server";
import { RATING_AND_REVIEWS_PER_BUCKET_COUNT } from "@/app/_config/pagination";
import { productReviewsCache, userReviewsCache } from "@/app/_config/cache";

interface createReviewParams {
  rating: 1 | 2 | 3 | 4 | 5;
  orderedProductId: string;
  reviewImages: string[];
  productId: string;
  storeId: string;
  review: string;
}

export const createReview = async (
  params: createReviewParams,
): Promise<ActionResult> => {
  try {
    const authUser = await currentUser();
    const dbUserId = authUser?.publicMetadata.dbUserId as string;

    if (!authUser || !dbUserId)
      return { success: false, message: "Unauthenticated" };

    const {
      rating,
      review,
      storeId,
      productId,
      reviewImages,
      orderedProductId,
    } = params;

    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: {
        detailedRatingsCount: true,
        ratingsCount: true,
        ratingsSum: true,
        avgRating: true,
        storeName: true,
        image: true,
        name: true,
      },
    });

    if (!product) return { success: false, message: "Invalid product id." };

    const newRatingsCount = product.ratingsCount + 1;
    const newRatingsSum = product.ratingsSum + rating;
    const newAvgRating = newRatingsSum / newRatingsCount;
    let newDetailedRatingsCount = product.detailedRatingsCount;
    newDetailedRatingsCount[rating] = newDetailedRatingsCount[rating] + 1;

    await prisma.$transaction([
      prisma.orderedProduct.update({
        where: { id: orderedProductId },
        data: { hasBeenReviewed: true },
      }),
      prisma.product.update({
        where: {
          id: productId,
        },
        data: {
          detailedRatingsCount: newDetailedRatingsCount,
          ratingsCount: newRatingsCount,
          ratingsSum: newRatingsSum,
          avgRating: newAvgRating,
        },
      }),
      prisma.$runCommandRaw({
        findAndModify: "RatingAndReviewBucket",

        query: {
          productId: { $oid: productId },
          count: { $lt: RATING_AND_REVIEWS_PER_BUCKET_COUNT },
        },

        update: {
          $push: {
            ratingAndReviews: {
              rating,
              review,
              reviewImages,
              productInformation: {
                id: productId,
                name: product.name,
                image: product.image,
                storeName: product.storeName,
              },
              userInformation: {
                name: authUser.username || authUser.firstName,
                image: authUser.imageUrl,
              },
              storeId: { $oid: storeId },
              userId: { $oid: dbUserId },
              productId: { $oid: productId },
              createdAt: { $date: new Date().toISOString() },
              orderedProductId: { $oid: orderedProductId },
            },
          },
          $inc: {
            count: 1,
          },
          $setOnInsert: {
            productInformation: {},
            storeId: { $oid: storeId },
            productId: { $oid: productId },
          },
        },

        upsert: true,
      }),
    ]);

    productReviewsCache.revalidate(productId); // Revalidating product reviews cache to ensure the latest reviews are displayed
    userReviewsCache.revalidate(dbUserId); // Revalidating user reviews cache to ensure the latest reviews are displayed

    return {
      success: true,
      message: "Succesfully published your review.",
    };
  } catch (e) {
    console.log("Error: ", e);
    return { success: false, message: "Something went wrong." };
  }
};
