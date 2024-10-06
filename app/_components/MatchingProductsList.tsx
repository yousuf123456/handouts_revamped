import React from "react";
import { ProductCard } from "./ProductCard";
import { ProductsListLayout } from "./ProductsListLayout";
import { MATCHING_PRODUCTS_PER_PAGE } from "../_config/pagination";
import { getMatchingProducts } from "../_serverFunctions/getMatchingProducts";
import { AtlasSearchPaginationControl } from "./AtlasSearchPaginationControl";

type MatchingProductsListProps = Parameters<typeof getMatchingProducts>[0];

export const MatchingProductsList = async (
  props: MatchingProductsListProps,
) => {
  const matchingProducts = await getMatchingProducts(props);
  const totalCount = matchingProducts[0].count;

  return (
    <div className="flex flex-col gap-8">
      <ProductsListLayout>
        {matchingProducts.map((product, i) => (
          <ProductCard key={i} dynamic product={product} />
        ))}
      </ProductsListLayout>

      {totalCount >= MATCHING_PRODUCTS_PER_PAGE && (
        <div className="mx-auto">
          <AtlasSearchPaginationControl
            totalCount={totalCount}
            itemsContainerId="matchingProductsContainer"
            itemsPerPage={MATCHING_PRODUCTS_PER_PAGE}
            firstItemPaginationToken={matchingProducts[0].paginationToken}
            lastItemPaginationToken={
              matchingProducts[matchingProducts.length - 1].paginationToken
            }
          />
        </div>
      )}
    </div>
  );
};
