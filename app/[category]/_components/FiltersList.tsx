"use client";

import React, { useState } from "react";

import { Filter } from "./Filter";
import { PriceFilter } from "./PriceFilter";
import { RatingFilter } from "./RatingFilter";
import { ProductFacets } from "@/app/[category]/_serverFunctions/getProductsFacets";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from "lucide-react";

type FiltersListProps = {
  filters: ProductFacets;
};

export const FiltersList = ({ filters }: FiltersListProps) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <>
      <Button
        size={"lg"}
        variant={"outline"}
        className="mb-4 text-base lg:hidden"
        onClick={() => setIsDrawerOpen(true)}
      >
        Filters <SlidersHorizontal className="ml-3 h-5 w-5" />
      </Button>

      <aside className="hidden w-64 lg:block">
        <Filters filters={filters} />
      </aside>

      <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <SheetContent className="w-[85%] overflow-y-auto scrollbar-none">
          <Filters filters={filters} />
        </SheetContent>
      </Sheet>
    </>
  );
};

function Filters({ filters }: { filters: ProductFacets }) {
  return (
    <div className="flex flex-col gap-2">
      <h2 className="mb-4 text-lg font-semibold">Filters</h2>

      <PriceFilter />

      <RatingFilter />

      {Object.keys(filters).map((filter, i) => (
        <Filter key={i} name={filter} filterOptions={filters[filter].buckets} />
      ))}
    </div>
  );
}
