import React from "react";

import { PaginationParams } from "@/app/_types";
import { PublishedReviewCard } from "./PublishedReviewCard";
import { USER_REVIEWS_PER_PAGE } from "@/app/_config/pagination";
import { PaginationControl } from "@/app/_components/PaginationControl";
import { getUserPublishedReviews } from "../_serverFunctions/getUserPublishedReviews";
import { userAuthentication } from "@/app/_serverFunctions/userAuthentication";
import { unstable_cache } from "next/cache";
import { userReviewsCache } from "@/app/_config/cache";
import { EmptyState } from "@/app/_components/EmptyState";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { routes } from "@/app/_config/routes";
import { Star } from "lucide-react";

export const PublishedReviews = async (props: PaginationParams) => {
  const { dbUserId, isUserAuthenticated } = userAuthentication();

  if (!isUserAuthenticated || !dbUserId) return <p>Unauthenticated</p>;

  const { publishedReviews, totalCount } = await unstable_cache(
    getUserPublishedReviews,
    userReviewsCache.keys,
    {
      tags: userReviewsCache.tags(dbUserId),
      revalidate: userReviewsCache.duration,
    },
  )({
    ...props,
    dbUserId,
  });

  if (publishedReviews.length === 0)
    return (
      <EmptyState
        Icon={Star}
        heading="No Reviews Yet"
        actionLabel="Love your new purchase? Share your experience by leaving a review and help others make the right choice!"
      >
        <Link href={routes.pendingReviews}>
          <Button size={"lg"} variant={"corners"} className="w-full uppercase">
            View Pending Reviews
          </Button>
        </Link>
      </EmptyState>
    );

  return (
    <div className="flex flex-col gap-5">
      {publishedReviews.map((publishedReview: any, i: number) => (
        <PublishedReviewCard publishedReview={publishedReview} key={i} />
      ))}

      <div className="mx-auto my-6">
        <PaginationControl
          totalCount={totalCount}
          itemsPerPage={USER_REVIEWS_PER_PAGE}
        />
      </div>
    </div>
  );
};
