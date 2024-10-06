import React from "react";
import { HeadingWrapper } from "../../_components/HeadingWrapper";
import { OrderDetailsSkeleton } from "../../_components/OrderDetailsSkeleton";

export default function OrderDetailsLoading() {
  return (
    <HeadingWrapper heading="Order Details">
      <OrderDetailsSkeleton />
    </HeadingWrapper>
  );
}
