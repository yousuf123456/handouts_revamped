import React from "react";
import { HeadingWrapper } from "../../_components/HeadingWrapper";
import { OrderDetailsSkeleton } from "../../_components/OrderDetailsSkeleton";

export default function OrderCancellationDetailsLoading() {
  return (
    <HeadingWrapper heading="Cancellation Details">
      <OrderDetailsSkeleton />
    </HeadingWrapper>
  );
}
