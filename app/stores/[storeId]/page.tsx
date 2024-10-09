import React from "react";

import { PaginationSearchParams } from "@/app/_types";
import { StoreOverview } from "./_components/StoreOverview";

type SearchParams = PaginationSearchParams & {
  productsCollectionName?: string;
};

export default async function StorePage({
  params,
  searchParams,
}: {
  params: { storeId: string };
  searchParams: SearchParams;
}) {
  const { productsCollectionName, page, filter, sort } = searchParams;

  return (
    <StoreOverview
      productsCollectionName={productsCollectionName}
      page={parseInt(page || "1")}
      storeId={params.storeId}
      filter={filter}
      sort={sort}
    />
  );
}
