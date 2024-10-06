"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { getSearchParamsStringsArray } from "@/app/_utils";

export const PriceFilter = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filters = searchParams.get("filters");
  const priceFilterValues = filters
    ?.split("|")
    .filter((filter) => filter.split("-")[0] === "price")[0]
    ?.split("-")[1]
    ?.split(",") as undefined | string[];

  const [minPrice, setMinPrice] = useState(
    priceFilterValues ? parseInt(priceFilterValues[0]) : 0,
  );
  const [maxPrice, setMaxPrice] = useState(
    priceFilterValues ? parseInt(priceFilterValues[1]) : 100,
  );

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(0, Math.min(Number(e.target.value), maxPrice));
    setMinPrice(value);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(minPrice, Math.min(Number(e.target.value), 10000));
    setMaxPrice(value);
  };

  const handleApply = () => {
    const searchParamStringsArray = getSearchParamsStringsArray(searchParams, [
      "filters",
    ]);

    let newFilters: any;
    if (!priceFilterValues) {
      newFilters = [
        ...(filters?.split("|") || []),
        `price-${minPrice},${maxPrice}`,
      ].join("|");
    } else {
      newFilters = filters
        ?.split("|")
        .map((filter) => {
          if (filter.split("-")[0] === "price") {
            return `price-${minPrice},${maxPrice}`;
          }

          return filter;
        })
        .join("|");
    }

    searchParamStringsArray.push(`filters=${newFilters}`);

    router.push(`${pathname}?${searchParamStringsArray.join("&")}`);
  };

  const handleClear = () => {
    const searchParamStringsArray = getSearchParamsStringsArray(searchParams, [
      "filters",
    ]);
    const newFilters = filters
      ?.split("|")
      .filter((filter) => filter.split("-")[0] !== "price")
      .join("|");

    if (newFilters) searchParamStringsArray.push(`filters=${newFilters}`);
    router.push(`${pathname}?${searchParamStringsArray.join("&")}`);
  };

  return (
    <div className="mb-9 w-full space-y-4">
      <div className="flex space-x-4">
        <div className="w-1/2">
          <label
            htmlFor="min-price"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Min Price
          </label>
          <Input
            type="number"
            id="min-price"
            value={minPrice}
            onChange={handleMinChange}
            className="w-full"
            min={0}
            max={maxPrice}
          />
        </div>
        <div className="w-1/2">
          <label
            htmlFor="max-price"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Max Price
          </label>
          <Input
            type="number"
            id="max-price"
            value={maxPrice}
            onChange={handleMaxChange}
            className="w-full"
            min={minPrice}
            max={10000}
          />
        </div>
      </div>

      <div className="flex gap-5">
        <Button onClick={handleApply} className="w-full">
          Apply
        </Button>
        <Button onClick={handleClear} variant={"secondary"} className="w-full">
          Clear
        </Button>
      </div>
    </div>
  );
};
