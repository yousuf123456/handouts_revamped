"use client";
import React, { useEffect, useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SortStringType } from "../_types";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { getSearchParamsStringsArray } from "../_utils";

interface SortItem {
  label: string;
  value: SortStringType;
  isDefault?: boolean;
}

export const SortControl = ({ sortItems }: { sortItems: SortItem[] }) => {
  const searchParams = useSearchParams();
  const initialSortBy = searchParams.get("sort") as SortStringType | null;
  const defaultItem = sortItems.filter((sortItem) => sortItem.isDefault)[0];

  const [sortBy, setSortBy] = useState<SortStringType>(
    initialSortBy || defaultItem.value,
  );

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const previousSort = searchParams.get("sort");
    if (previousSort === sortBy) return;

    let searchParamsStringsArray = getSearchParamsStringsArray(searchParams, [
      "sort",
      "page",
    ]);

    if (sortBy === defaultItem.value) {
      router.push(`${pathname}?${searchParamsStringsArray.join("&")}`);
      return;
    }

    searchParamsStringsArray.push(`sort=${sortBy}`);
    router.push(`${pathname}?${searchParamsStringsArray.join("&")}`);
  }, [sortBy]);

  return (
    <Select value={sortBy} onValueChange={setSortBy as any}>
      <SelectTrigger className="w-full sm:w-[180px]">
        <SelectValue placeholder="Sort by" />
      </SelectTrigger>
      <SelectContent>
        {sortItems.map((sortItem, i) => (
          <SelectItem key={i} value={sortItem.value}>
            {sortItem.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
