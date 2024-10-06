import React from "react";

import prisma from "@/app/_libs/prismadb";
import { HeadingWrapper } from "../_components/HeadingWrapper";
import { WriteReviewForm } from "./_components/WriteReviewForm";

interface SearchParams {
  orderedProductId?: string;
}

export default async function WriteReviewPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  if (!searchParams.orderedProductId) return;

  const orderedProduct = await prisma.orderedProduct.findUnique({
    where: { id: searchParams.orderedProductId },
  });

  if (!orderedProduct) return;

  return (
    <HeadingWrapper heading="Write Review">
      <WriteReviewForm orderedProduct={orderedProduct} />
    </HeadingWrapper>
  );
}
