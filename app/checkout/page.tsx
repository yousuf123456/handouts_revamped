import React from "react";
import { CheckoutSummary } from "./_components/CheckoutSummary";
import { notFound } from "next/navigation";

interface SearchParams {
  fromCart?: string;
  quantity?: string;
  productId?: string;
  selectedCombinationId?: string;
}

export default function Checkout({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { fromCart, quantity, productId, selectedCombinationId } = searchParams;

  if (fromCart !== "true" && (!quantity || !productId)) return notFound();

  return (
    <div className="mx-auto w-full max-w-screen-xl px-4 py-8 md:pt-12">
      <h1 className="mb-8 text-center text-2xl font-medium uppercase">
        Checkout
      </h1>

      <CheckoutSummary
        productId={productId}
        fromCart={fromCart === "true"}
        quantity={parseInt(quantity || "1")}
        selectedCombinationId={selectedCombinationId}
      />
    </div>
  );
}
