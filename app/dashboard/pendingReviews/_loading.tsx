import React from "react";
import { HeadingWrapper } from "../_components/HeadingWrapper";
import { PendingReviewSkeleton } from "./_components/PendingReviewSkeleton";

export default function PendingReviewsLoading() {
  return (
    <HeadingWrapper heading="Pending Products Reviews">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <PendingReviewSkeleton />
        <PendingReviewSkeleton />
        <PendingReviewSkeleton />
      </div>
    </HeadingWrapper>
  );
}
