import React from "react";
import { HeadingWrapper } from "../../_components/HeadingWrapper";
import { OrderDetailsSkeleton } from "../../_components/OrderDetailsSkeleton";

export default function OrderReturnDetailsLoading() {
  return (
    <HeadingWrapper heading="Return Details">
      <OrderDetailsSkeleton />
    </HeadingWrapper>
  );
}
