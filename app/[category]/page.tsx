import React from "react";

import { AtlasSearchPaginationParams } from "../_types";
import { ProductCatalog } from "./_components/ProductCatalog";
import { redirect } from "next/navigation";
import { routes } from "../_config/routes";

type SearchParams = AtlasSearchPaginationParams & {
  q?: string;
  filters?: any;
  storeId?: string;
};

interface Params {
  category: string;
}

export default async function SearchPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  // Check if any search query is provided
  if (params.category === "search" && !searchParams.q) redirect(routes.home);

  return (
    <ProductCatalog
      {...searchParams}
      query={searchParams.q}
      category={params.category}
      storeId={searchParams.storeId}
    />
  );
}
