import React, { Suspense } from "react";

import OrderDetailsLoading from "./_loading";
import { OrderDetails } from "./_components/OrderDetails";
import { HeadingWrapper } from "../../_components/HeadingWrapper";

interface Params {
  orderId: string;
}

export default async function OrderDetailsPage({ params }: { params: Params }) {
  return (
    <Suspense key={params.orderId} fallback={<OrderDetailsLoading />}>
      <HeadingWrapper heading="Order Details">
        <OrderDetails orderId={params.orderId} />
      </HeadingWrapper>
    </Suspense>
  );
}
