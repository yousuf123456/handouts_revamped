import React from "react";
import { HeadingWrapper } from "../_components/HeadingWrapper";
import { PublishedReviewSkeleton } from "./_components/PublishedReviewSkeleton";

export const PublishedReviewsLoading = () => {
  return (
    <HeadingWrapper heading="Published Products Reviews">
      <PublishedReviewSkeleton />
      <PublishedReviewSkeleton />
      <PublishedReviewSkeleton />
    </HeadingWrapper>
  );
};
