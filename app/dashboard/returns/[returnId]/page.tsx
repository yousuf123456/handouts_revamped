import React, { Suspense } from "react";
import { HeadingWrapper } from "../../_components/HeadingWrapper";
import { ReturnDetails } from "./_components/ReturnDetails";
import OrderReturnDetailsLoading from "./_loading";

interface Params {
  returnId: string;
}

export default function ReturnDetailsPage({ params }: { params: Params }) {
  return (
    <Suspense key={params.returnId} fallback={<OrderReturnDetailsLoading />}>
      <HeadingWrapper heading="Return Details">
        <ReturnDetails returnId={params.returnId} />
      </HeadingWrapper>
    </Suspense>
  );
}
