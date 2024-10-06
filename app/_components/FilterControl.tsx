"use client";
import React, { useEffect, useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { FilterStringType } from "../_types";
import { getSearchParamsStringsArray } from "../_utils";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

interface FilterItem {
  label: string;
  isDefault?: boolean;
  value: FilterStringType;
}

export const FilterControl = ({
  filterItems,
}: {
  filterItems: FilterItem[];
}) => {
  const defaultItem = filterItems.filter(
    (filterItem) => filterItem.isDefault,
  )[0];

  const searchParams = useSearchParams();
  const initialFilterBy = searchParams.get("filter") as FilterStringType | null;

  const [filterBy, setFilterBy] = useState<FilterStringType>(
    initialFilterBy || defaultItem.value,
  );

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const previousFilter = searchParams.get("filter");
    if (previousFilter === filterBy) return;

    let searchParamsStringsArray = getSearchParamsStringsArray(searchParams, [
      "filter",
      "page",
    ]);

    if (filterBy === defaultItem.value) {
      router.push(`${pathname}?${searchParamsStringsArray.join("&")}`);
      return;
    }

    searchParamsStringsArray.push(`filter=${filterBy}`);
    router.push(`${pathname}?${searchParamsStringsArray.join("&")}`);
  }, [filterBy]);

  return (
    <Select value={filterBy} onValueChange={setFilterBy as any}>
      <SelectTrigger className="w-full sm:w-[180px]">
        <SelectValue placeholder="Filter by" />
      </SelectTrigger>
      <SelectContent>
        {filterItems.map((filterItem, i) => (
          <SelectItem key={i} value={filterItem.value}>
            {filterItem.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
