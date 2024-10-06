import React, { Suspense } from "react";
import { PaginationSearchParams } from "@/app/_types";
import { HeadingWrapper } from "../_components/HeadingWrapper";
import { PublishedReviews } from "./_components/PublishedReviews";
import { PublishedReviewsLoading } from "./_loading";

type SearchParams = PaginationSearchParams;

export default async function PublishedReviewsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  return (
    <Suspense
      fallback={<PublishedReviewsLoading />}
      key={parseInt(searchParams.page || "1")}
    >
      <HeadingWrapper heading="Published Products Reviews">
        <PublishedReviews
          page={parseInt(searchParams.page || "1")}
          filter={undefined}
          sort={undefined}
        />
      </HeadingWrapper>
    </Suspense>
  );
}
