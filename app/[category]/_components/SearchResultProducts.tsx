import React from "react";

import { searchProducts } from "@/app/[category]/_serverFunctions/searchProducts";

import Image from "next/image";

import Link from "next/link";
import { NoProducts } from "./NoProducts";
import { AtlasSearchPaginationParams } from "@/app/_types";
import { ProductCard } from "@/app/_components/ProductCard";
import { SEARCH_PRODUCTS_PER_PAGE } from "@/app/_config/pagination";
import { AtlasSearchPaginationControl } from "@/app/_components/AtlasSearchPaginationControl";
import { getCachedStore } from "@/app/stores/[storeId]/serverFunctions/getStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { buttonVariants } from "@/components/ui/button";
import { notFound } from "next/navigation";

type ProductCatalogProps = AtlasSearchPaginationParams & {
  category: string;
  query: string | undefined;
  storeId: string | undefined;
};

export const SearchResultProducts = async ({
  query,
  storeId,
  category,
  ...searchParams
}: ProductCatalogProps) => {
  const storeInfo = storeId ? await getCachedStore({ storeId }) : null;

  if (storeId && !storeInfo) return notFound();

  const products = await searchProducts({
    query,
    storeId,
    category,
    ...searchParams,
  });

  const totalProductsCount = products[0]?.count || 0;

  return (
    <div id="searchedProductsCont" className="flex-1">
      {products.length === 0 ? (
        <NoProducts />
      ) : (
        <>
          <div className="mb-6 flex items-center justify-between rounded-lg border bg-white p-3 shadow-sm">
            <div className="flex items-center space-x-4">
              {storeInfo && (
                <Avatar className="h-10 w-10">
                  <AvatarImage asChild src={storeInfo.logo || undefined}>
                    <Image src={storeInfo.logo || ""} alt="User Profile" fill />
                  </AvatarImage>
                  <AvatarFallback>
                    {storeInfo.name[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              )}

              <div>
                {storeInfo && (
                  <h2 className="text-sm font-semibold">{storeInfo.name}</h2>
                )}

                <p className="text-sm text-muted-foreground">
                  Showing {totalProductsCount} products for{" "}
                  {category === "search"
                    ? query
                    : query
                    ? `'${query}' in '${category}' products category.`
                    : `'${category}' products category.`}
                  .
                </p>
              </div>
            </div>

            {storeId && (
              <Link
                href={`/${category || "search"}${query ? `?q=${query}` : ``}`}
                className={buttonVariants({
                  variant: "outline",
                  size: "sm",
                })}
              >
                View All Stores
              </Link>
            )}
          </div>

          <div className="grid grid-cols-1 gap-8 min-[480px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
            {products.map((product, i) => (
              <ProductCard key={i} product={product} dynamic />
            ))}
          </div>

          {products.length > 0 && (
            <div className="mt-16 flex justify-center">
              <AtlasSearchPaginationControl
                totalCount={totalProductsCount}
                itemsContainerId="searchedProductsCont"
                itemsPerPage={SEARCH_PRODUCTS_PER_PAGE}
                firstItemPaginationToken={products[0].paginationToken}
                lastItemPaginationToken={
                  products[products.length - 1].paginationToken
                }
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};
