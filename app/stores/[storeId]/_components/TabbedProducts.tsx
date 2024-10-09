import React, { Suspense } from "react";

import { ProductTabs } from "./ProductTabs";
import { AllProducts } from "./AllProducts";
import { PaginationParams } from "@/app/_types";
import { ProductsListLayout } from "@/app/_components/ProductsListLayout";
import { ProductCardSkeleton } from "@/app/_components/ProductCardSkeleton";
import { ProductsCollection } from "@prisma/client";
import { StoreProductsCollection } from "./StoreProductsCollection";
import { redirect } from "next/navigation";
import { routes } from "@/app/_config/routes";

export const TabbedProducts = ({
  page,
  storeId,
  productsCollectionName,
  storeProductCollections,
  ...paginationParams
}: {
  storeId: string;
  productsCollectionName: string | undefined;
  storeProductCollections: ProductsCollection[];
} & PaginationParams) => {
  const productCollectionNames = storeProductCollections.map((col) => col.name);

  const storeProductsCollection = storeProductCollections.find(
    (col) => col.name === productsCollectionName,
  );

  if (productsCollectionName && !storeProductsCollection)
    return redirect(routes.storeDetails(storeId));

  return (
    <section className="py-12">
      <div className="mx-auto flex max-w-screen-xl flex-col gap-6 px-4">
        <ProductTabs productCollectionNames={productCollectionNames} />

        <Suspense
          key={`${productsCollectionName || "All Products"}-${page}`}
          fallback={<ProductsLoading />}
        >
          {productsCollectionName ? (
            <StoreProductsCollection
              page={page}
              storeId={storeId}
              {...paginationParams}
              productsCollectionId={storeProductsCollection!.id}
            />
          ) : (
            <AllProducts page={page} storeId={storeId} {...paginationParams} />
          )}
        </Suspense>
      </div>
    </section>
  );
};

function ProductsLoading() {
  return (
    <ProductsListLayout>
      <ProductCardSkeleton dynamic />
      <ProductCardSkeleton dynamic />
      <ProductCardSkeleton dynamic />
      <ProductCardSkeleton dynamic />
      <ProductCardSkeleton dynamic />
    </ProductsListLayout>
  );
}
