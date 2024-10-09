import React, { Suspense } from "react";
import { HeroSection } from "./_components/HeroSection";
import TrendingStyles from "./_components/TrendingStyles";
import { AtlasSearchPaginationSearchParams } from "../_types";
import { ProductsListLayout } from "../_components/ProductsListLayout";
import { ProductCardSkeleton } from "../_components/ProductCardSkeleton";
import { RecomendedProducts } from "./_components/RecomendedProducts";
import Collabs from "./_components/Collabs";

type SearchParams = AtlasSearchPaginationSearchParams;

export default function LandingPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  return (
    <div className="relative -top-[80px] ">
      <HeroSection />

      <TrendingStyles />

      <Collabs />

      <RecomendedProducts
        filters={undefined}
        paginationToken={searchParams.paginationToken}
        pageDirection={searchParams.pageDirection as "next" | "prev"}
      />
    </div>
  );
}
