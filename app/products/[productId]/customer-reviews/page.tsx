import React from "react";
import { PaginationSearchParams } from "@/app/_types";
import { ProductReviews } from "./_components/ProductReviews";

interface IParams {
  productId: string;
}

export default async function CustomerReviewsPage({
  params,
  searchParams,
}: {
  params: IParams;
  searchParams: PaginationSearchParams;
}) {
  return (
    <div className="container bg-white px-4 pt-8 md:px-8 md:pt-14">
      <ProductReviews
        sort={searchParams.sort}
        filter={searchParams.filter}
        productId={params.productId}
        page={parseInt(searchParams.page || "1")}
      />
    </div>
  );
}
