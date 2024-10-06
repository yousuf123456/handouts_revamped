"use client";

import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { getSearchParamsStringsArray } from "../_utils";

export const PaginationControl = ({
  totalCount,
  itemsPerPage,
}: {
  totalCount: number;
  itemsPerPage: number;
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") || "1");

  const numberOfPages = Math.ceil(totalCount / itemsPerPage);

  const goOnNextPage = () => {
    if (currentPage === numberOfPages) return;

    let searchParamsStringsArray = getSearchParamsStringsArray(searchParams, [
      "page",
    ]);

    searchParamsStringsArray.push(`page=${currentPage + 1}`);

    router.push(`${pathname}?${searchParamsStringsArray.join("&")}`);
  };

  const goOnPrevPage = () => {
    if (currentPage === 1) return;

    let searchParamsStringsArray = getSearchParamsStringsArray(searchParams, [
      "page",
    ]);

    if (currentPage - 1 !== 1)
      searchParamsStringsArray.push(`page=${currentPage - 1}`);

    router.push(`${pathname}?${searchParamsStringsArray.join("&")}`);
  };

  useEffect(() => {
    // If user tries to go to the page beyond the limits
    if (currentPage > numberOfPages || currentPage < 1) {
      let searchParamsStringsArray = getSearchParamsStringsArray(searchParams, [
        "page",
      ]);

      searchParamsStringsArray.push(`page=1`);

      router.push(`${pathname}?${searchParamsStringsArray.join("&")}`);
    }
  }, [currentPage]);

  return (
    <div className="flex space-x-2">
      <Button
        size="sm"
        variant="outline"
        onClick={goOnPrevPage}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="sr-only sm:not-sr-only sm:ml-2">Previous</span>
      </Button>

      <Button variant="outline" size="sm" disabled>
        Page {currentPage} of {numberOfPages}
      </Button>

      <Button
        size="sm"
        variant="outline"
        onClick={goOnNextPage}
        disabled={currentPage === numberOfPages}
      >
        <span className="sr-only sm:not-sr-only sm:mr-2">Next</span>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};
