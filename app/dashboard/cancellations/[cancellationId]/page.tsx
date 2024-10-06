import React, { Suspense } from "react";
import { HeadingWrapper } from "../../_components/HeadingWrapper";
import { CancellationDetails } from "./_components/CancellationDetails";
import OrderCancellationDetailsLoading from "./_loading";

interface Params {
  cancellationId: string;
}

export default function CancellationDetailsPage({
  params,
}: {
  params: Params;
}) {
  return (
    <Suspense
      key={params.cancellationId}
      fallback={<OrderCancellationDetailsLoading />}
    >
      <HeadingWrapper heading="Cancellation Details">
        <CancellationDetails cancellationId={params.cancellationId} />
      </HeadingWrapper>
    </Suspense>
  );
}
