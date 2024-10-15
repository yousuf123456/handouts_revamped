import React from "react";

import { unstable_cache } from "next/cache";
import { productReviewsCache } from "@/app/_config/cache";
import { RatingAndReviewCard } from "./RatingAndReviewCard";
import { getProductReviews } from "@/app/products/[productId]/customer-reviews/_serverFunctions/getProductReviews";
import { EmptyState } from "@/app/_components/EmptyState";
import { Star } from "lucide-react";
import Link from "next/link";
import { routes } from "@/app/_config/routes";
import { Button } from "@/components/ui/button";

type ProductReviewsListProps = Parameters<typeof getProductReviews>[0] & {
  listOnePageOnly?: boolean;
};

export const ProductReviewsList = async ({
  page,
  productId,
  listOnePageOnly,
  ...getProductReviewsParams
}: ProductReviewsListProps) => {
  const getCachedProductReviews = unstable_cache(
    getProductReviews,
    productReviewsCache.keys,
    {
      tags: productReviewsCache.tags(productId!),
      revalidate: productReviewsCache.revalidateDuration,
    },
  );

  const ratingAndReviews = await getCachedProductReviews({
    page: listOnePageOnly ? 1 : page,
    productId,
    ...getProductReviewsParams,
  });

  if (ratingAndReviews.length === 0)
    return (
      <EmptyState
        Icon={Star}
        heading="No Reviews"
        actionLabel="Be the first to review this product—no reviews available yet!"
      />
    );

  return (
    <div className="flex flex-col gap-5">
      {ratingAndReviews.map((ratingAndReview, i) => (
        <RatingAndReviewCard key={i} ratingAndReview={ratingAndReview} />
      ))}
    </div>
  );
};
