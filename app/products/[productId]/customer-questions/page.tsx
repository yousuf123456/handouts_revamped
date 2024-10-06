import React from "react";

import { PaginationSearchParams } from "@/app/_types";
import { ProductQuestions } from "./_components/ProductQuestions";

interface IParams {
  productId: string;
}

export default async function ProductQuestionsPage({
  searchParams,
  params,
}: {
  searchParams: PaginationSearchParams;
  params: IParams;
}) {
  return (
    <div className="container bg-white px-4 pt-8 md:px-8 md:pt-14">
      <ProductQuestions
        sort={searchParams.sort}
        productId={params.productId}
        filter={searchParams.filter}
        page={parseInt(searchParams.page || "1")}
      />
    </div>
  );
}
