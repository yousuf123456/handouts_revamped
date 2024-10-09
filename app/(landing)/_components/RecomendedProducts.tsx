import React, { Suspense } from "react";

import prisma from "@/app/_libs/prismadb";
import getDBUser from "@/app/_serverActions/getDBUser";
import { MatchingProductsList } from "@/app/_components/MatchingProductsList";
import { AtlasSearchPaginationParams } from "@/app/_types";
import { Product } from "@prisma/client";
import { ProductsListLayout } from "@/app/_components/ProductsListLayout";
import { ProductCardSkeleton } from "@/app/_components/ProductCardSkeleton";

export const RecomendedProducts = async ({
  pageDirection,
  paginationToken,
}: AtlasSearchPaginationParams) => {
  const { user } = await getDBUser({
    includeFields: { browsingHistory: true },
  });

  const randomProduct =
    (user?.browsingHistory.length || 0) > 0
      ? null
      : await prisma.product.findFirst();

  const productsToMatch =
    user && user.browsingHistory.length > 0
      ? user.browsingHistory
      : [randomProduct as Product];

  return (
    <div
      id="matchingProductsContainer"
      className="mx-auto max-w-screen-xl py-12"
    >
      <h2 className="my-12 text-center text-3xl font-bold uppercase text-gray-800 sm:text-4xl">
        Recomendation
      </h2>

      <Suspense key={paginationToken} fallback={<RecomdedProductsLoading />}>
        <MatchingProductsList
          productsToMatch={productsToMatch}
          paginationToken={paginationToken}
          pageDirection={pageDirection as "next" | "prev"}
        />
      </Suspense>
    </div>
  );
};

function RecomdedProductsLoading() {
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
