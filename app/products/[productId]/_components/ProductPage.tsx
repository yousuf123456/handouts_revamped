import React, { Suspense } from "react";

import { Loading } from "./loadings/Loading";
import { ProductOverview } from "./ProductOverview";
import { getProductPromos } from "../_serverFunctions/getProductPromos";
import { getProductDetails } from "../_serverFunctions/getProductDetails";

import { AtlasSearchPaginationSearchParams } from "@/app/_types";

import CategoriesBreadcrumbs from "./CategoriesBreadcrumbs";
import { Category } from "@prisma/client";
import { notFound } from "next/navigation";

interface InformationProps {
  productId: string;
  searchParams: AtlasSearchPaginationSearchParams;
}

export default async function ProductPage({
  productId,
  searchParams,
}: InformationProps) {
  const productDetails = await getProductDetails({ productId });

  if (!productDetails) {
    return notFound();
  }

  const { vouchers, freeShippings } = await getProductPromos({
    productId,
    storeId: productDetails.storeId,
  });

  const categories = productDetails.categoryTreeData as Category[];

  return (
    <Suspense fallback={<Loading />}>
      <div className="flex flex-col gap-2">
        <CategoriesBreadcrumbs
          categories={categories}
          productName={productDetails.name}
        />

        <ProductOverview
          vouchers={vouchers}
          product={productDetails}
          searchParams={searchParams}
          freeShippings={freeShippings}
        />
      </div>
    </Suspense>
  );
}
