import React from "react";

import ProductPage from "./_components/ProductPage";
import { AtlasSearchPaginationSearchParams } from "@/app/_types";

interface IParams {
  productId: string;
}

export const revalidate = 3600;

export default async function ProductDetailsPage({
  params,
  searchParams,
}: {
  params: IParams;
  searchParams: AtlasSearchPaginationSearchParams;
}) {
  return (
    <div className="w-full overflow-x-hidden bg-white min-[960px]:px-6 min-[960px]:py-12 xl:px-12">
      <div className="flex flex-col gap-6">
        <ProductPage productId={params.productId} searchParams={searchParams} />
      </div>
    </div>
  );
}
