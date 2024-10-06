"use client";
import React, { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getSearchParamsStringsArray, scrollToElement } from "../_utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface AtlasSearchPaginationControl {
  totalCount: number;
  itemsPerPage: number;
  itemsContainerId?: string;
  lastItemPaginationToken: string;
  firstItemPaginationToken: string;
}

export const AtlasSearchPaginationControl = ({
  totalCount,
  itemsPerPage,
  itemsContainerId,
  lastItemPaginationToken,
  firstItemPaginationToken,
}: AtlasSearchPaginationControl) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const page = parseInt(searchParams.get("page") || "1");

  const numberOfPages = Math.ceil(totalCount / itemsPerPage);

  const goOnNextPage = () => {
    if (page === numberOfPages) return;

    let searchParamsStringsArray = getSearchParamsStringsArray(searchParams, [
      "paginationToken",
      "pageDirection",
      "page",
    ]);

    searchParamsStringsArray.push(
      `page=${page + 1}&pageDirection=next&paginationToken=${encodeURIComponent(
        lastItemPaginationToken,
      )}`,
    );

    if (itemsContainerId) scrollToElement(itemsContainerId, 120);
    router.push(`${pathname}?${searchParamsStringsArray.join("&")}`, {
      scroll: false,
    });
  };

  const goOnPrevPage = () => {
    if (page === 1) return;

    let searchParamsStringsArray = getSearchParamsStringsArray(searchParams, [
      "paginationToken",
      "pageDirection",
      "page",
    ]);

    if (page - 1 !== 1)
      searchParamsStringsArray.push(
        `page=${
          page - 1
        }&pageDirection=prev&paginationToken=${encodeURIComponent(
          firstItemPaginationToken,
        )}`,
      );

    if (itemsContainerId) scrollToElement(itemsContainerId, 120);
    router.push(`${pathname}?${searchParamsStringsArray.join("&")}`, {
      scroll: false,
    });
  };

  return (
    <div className="flex space-x-2">
      <Button
        size="sm"
        disabled={page === 1}
        variant="outline"
        onClick={goOnPrevPage}
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="sr-only sm:not-sr-only sm:ml-2">Previous</span>
      </Button>

      <Button
        size="sm"
        disabled={page === numberOfPages}
        variant="outline"
        onClick={goOnNextPage}
      >
        <span className="sr-only sm:not-sr-only sm:mr-2">Next</span>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};
