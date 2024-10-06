import React from "react";
import { unstable_cache } from "next/cache";

import { PaginationParams } from "@/app/_types";
import { getCollectionProducts } from "../serverFunctions/getCollectionProducts";
import { storeCollectionProductsCache } from "@/app/_config/cache";
import { ProductsListLayout } from "@/app/_components/ProductsListLayout";
import { ProductCard } from "@/app/_components/ProductCard";
import { PaginationControl } from "@/app/_components/PaginationControl";
import { STORE_PRODUCTS_PER_PAGE } from "@/app/_config/pagination";

export const StoreProductsCollection = async ({
  storeId,
  productsCollectionId,
  ...paginationParams
}: {
  storeId: string;
  productsCollectionId: string;
} & PaginationParams) => {
  const { collectionProducts, totalCount } = await unstable_cache(
    getCollectionProducts,
    storeCollectionProductsCache.keys,
    {
      revalidate: storeCollectionProductsCache.duration,
      tags: storeCollectionProductsCache.tags(storeId),
    },
  )({
    storeId,
    ...paginationParams,
    productsCollectionId,
  });

  return (
    <div className="flex flex-col gap-10">
      <ProductsListLayout>
        {collectionProducts.map((product, i) => (
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
