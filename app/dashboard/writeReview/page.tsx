import React from "react";

import prisma from "@/app/_libs/prismadb";
import { HeadingWrapper } from "../_components/HeadingWrapper";
import { WriteReviewForm } from "./_components/WriteReviewForm";
import { notFound } from "next/navigation";

interface SearchParams {
  orderedProductId?: string;
}

export default async function WriteReviewPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  if (!searchParams.orderedProductId) return notFound();

  const orderedProduct = await prisma.orderedProduct.findUnique({
    where: { id: searchParams.orderedProductId },
  });

  if (!orderedProduct) return notFound();

  return (
    <HeadingWrapper heading="Write Review">
      <WriteReviewForm orderedProduct={orderedProduct} />
    </HeadingWrapper>
  );
}
