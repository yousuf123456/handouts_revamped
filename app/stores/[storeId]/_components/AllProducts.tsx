import React from "react";

import { PaginationParams } from "@/app/_types";
import { getStoreProducts } from "../serverFunctions/getStoreProducts";
import { ProductsListLayout } from "@/app/_components/ProductsListLayout";
import { ProductCard } from "@/app/_components/ProductCard";
import { PaginationControl } from "@/app/_components/PaginationControl";
import { STORE_PRODUCTS_PER_PAGE } from "@/app/_config/pagination";
import { unstable_cache } from "next/cache";
import { storeProductsCache } from "@/app/_config/cache";

export const AllProducts = async ({
  page,
  storeId,
  ...paginationParams
}: { storeId: string } & PaginationParams) => {
  const { storeProducts, totalCount } = await unstable_cache(
    getStoreProducts,
    storeProductsCache.keys,
    {
      revalidate: storeProductsCache.duration,
      tags: storeProductsCache.tags(storeId),
    },
  )({
    page,
    storeId,
    ...paginationParams,
  });

  return (
    <div className="flex flex-col gap-10">
      <ProductsListLayout>
        {storeProducts.map((product, i) => (
          <ProductCard key={i} product={product} dynamic />
        ))}
      </ProductsListLayout>

      <div className="mx-auto">
        <PaginationControl
          totalCount={totalCount}
          itemsPerPage={STORE_PRODUCTS_PER_PAGE}
        />
      </div>
    </div>
  );
};
