import React from "react";

import { StoreHeader } from "./StoreHeader";
import { unstable_cache } from "next/cache";
import { PaginationParams } from "@/app/_types";
import { TabbedProducts } from "./TabbedProducts";
import { storeRecordCache } from "@/app/_config/cache";
import { getStore } from "../serverFunctions/getStore";

type StoreOverviewProps = {
  storeId: string;
  productsCollectionName: string | undefined;
} & PaginationParams;

export const StoreOverview = async ({
  storeId,
  productsCollectionName,
  ...paginationParams
}: StoreOverviewProps) => {
  const storeInfo = await unstable_cache(getStore, storeRecordCache.keys, {
    revalidate: storeRecordCache.duration,
    tags: storeRecordCache.tags(storeId),
  })({ storeId: storeId });

  if (!storeInfo) return <p>Invalid Store Id</p>;

  return (
    <div>
      <StoreHeader storeInfo={storeInfo} />

      <TabbedProducts
        storeId={storeInfo.id}
        productsCollectionName={productsCollectionName}
        storeProductCollections={storeInfo.productCollections}
        {...paginationParams}
      />
    </div>
  );
};
