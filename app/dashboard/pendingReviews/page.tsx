import React, { Suspense } from "react";
import { PaginationSearchParams } from "@/app/_types";
import { HeadingWrapper } from "../_components/HeadingWrapper";
import { UnreviewedOrderedProducts } from "./_components/UnreviewedOrderedProducts";
import PendingReviewsLoading from "./_loading";

type SearchParams = PaginationSearchParams;

export default function PendingReviewsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  return (
    <Suspense
      key={parseInt(searchParams.page || "1")}
      fallback={<PendingReviewsLoading />}
    >
      <HeadingWrapper heading="Pending Products Reviews">
        <UnreviewedOrderedProducts
          page={parseInt(searchParams.page || "1")}
          filter={undefined}
          sort={undefined}
        />
      </HeadingWrapper>
    </Suspense>
  );
}
