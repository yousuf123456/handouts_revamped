import React, { Suspense } from "react";

import { ProductCardSkeleton } from "@/app/_components/ProductCardSkeleton";
import { SearchResultProducts } from "./SearchResultProducts";
import { AtlasSearchPaginationParams } from "@/app/_types";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductFilters } from "./ProductFilters";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

function generateKeyFromObject(searchParams: { [key: string]: any }) {
  return Object.entries(searchParams)
    .filter(([_, value]) => value !== undefined)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}:${value}`)
    .join("|");
}

type ProductCatalogProps = AtlasSearchPaginationParams & {
  category: string;
  query: string | undefined;
  storeId: string | undefined;
};

export const ProductCatalog = ({
  query,
  storeId,
  category,
  ...searchParams
}: ProductCatalogProps) => {
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12 md:px-6">
      <div className="relative mx-auto flex w-full max-w-screen-2xl flex-col lg:flex-row lg:gap-12">
        <Suspense fallback={<FiltersLoading />}>
          <ProductFilters query={query} storeId={storeId} category={category} />
        </Suspense>

        <Suspense
          key={generateKeyFromObject({
            ...searchParams,
            query,
            storeId,
            category,
          })}
          fallback={<ProductsLoading />}
        >
          <SearchResultProducts
            query={query}
            storeId={storeId}
            category={category}
            {...searchParams}
          />
        </Suspense>
      </div>
    </div>
  );
};

function FiltersLoading() {
  return (
    <div className="w-full lg:max-w-[256px]">
      <Skeleton className="hidden min-h-screen w-full bg-gray-200 lg:block" />

      <Button
        size={"lg"}
        variant={"outline"}
        className="mb-4 flex w-full gap-3 text-base lg:hidden"
      >
        Filters <Loader2 className="h-5 w-5 animate-spin" />
      </Button>
    </div>
  );
}

function ProductsLoading() {
  return (
    <div className="flex-1">
      <div className="mb-6 flex items-center justify-between rounded-lg border bg-white p-3 shadow-sm">
        <p className="text-sm text-muted-foreground">Finding products...</p>
      </div>

      <div className="grid grid-cols-1 gap-8 min-[480px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
        <ProductCardSkeleton dynamic className="bg-gray-200" />
        <ProductCardSkeleton dynamic className="bg-gray-200" />
        <ProductCardSkeleton dynamic className="bg-gray-200" />
        <ProductCardSkeleton dynamic className="bg-gray-200" />
      </div>
    </div>
  );
}
