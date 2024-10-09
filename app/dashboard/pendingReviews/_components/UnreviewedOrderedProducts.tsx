import React from "react";

import { unstable_cache } from "next/cache";
import { userPendingReviewsCache } from "@/app/_config/cache";

import WriteReviewCTA from "./WriteReviewCTA";
import { PaginationParams } from "@/app/_types";
import { USER_REVIEWS_PER_PAGE } from "@/app/_config/pagination";
import { userAuthentication } from "@/app/_serverFunctions/userAuthentication";
import { PaginationControl } from "@/app/_components/PaginationControl";
import { getUnreviewedOrderedProducts } from "../_serverFunctions/getUnreviewedOrderedProducts";
import { StarHalf } from "lucide-react";
import { EmptyState } from "@/app/_components/EmptyState";
import Link from "next/link";
import { getSignInUrl, routes } from "@/app/_config/routes";
import { Button } from "@/components/ui/button";
import { notFound, ReadonlyURLSearchParams, redirect } from "next/navigation";

export const UnreviewedOrderedProducts = async (props: PaginationParams) => {
  const { isUserAuthenticated, dbUserId } = userAuthentication();

  if (!isUserAuthenticated)
    return redirect(
      getSignInUrl(
        routes.pendingReviews,
        new URLSearchParams() as ReadonlyURLSearchParams,
      ),
    );

  if (!dbUserId) return notFound();

  const { unreviewedOrderedProducts, totalCount } = await unstable_cache(
    getUnreviewedOrderedProducts,
    userPendingReviewsCache.keys,
    {
      tags: userPendingReviewsCache.tags(dbUserId),
      revalidate: userPendingReviewsCache.duration,
    },
  )({ ...props, dbUserId });

  if (unreviewedOrderedProducts.length === 0)
    return (
      <EmptyState
        Icon={StarHalf}
        heading="No Pending Reviews"
        actionLabel="You can review your products once they’re delivered—your feedback helps us improve!"
      >
        <Link href={routes.orders}>
          <Button size={"lg"} variant={"corners"} className="w-full uppercase">
            View Orders
          </Button>
        </Link>
      </EmptyState>
    );

  return (
    <div className="flex flex-col gap-10">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {unreviewedOrderedProducts.map((orderedProduct, i) => (
          <WriteReviewCTA key={i} orderedProduct={orderedProduct} />
        ))}
      </div>

      <div className="mx-auto">
        <PaginationControl
          totalCount={totalCount}
          itemsPerPage={USER_REVIEWS_PER_PAGE}
        />
      </div>
    </div>
  );
};
