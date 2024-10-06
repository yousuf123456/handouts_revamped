"use client";

import { cn } from "@/app/_utils/cn";
import { getSearchParamsStringsArray } from "@/app/_utils";
import { Star } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function RatingFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filters = searchParams.get("filters");

  const selectedRating = parseInt(
    filters
      ?.split("|")
      .filter((filter) => filter.split("-")[0] === "avgRating")[0]
      ?.split("-")[1] || "z",
  ) as number | typeof NaN;

  const handleClick = (rating: number) => {
    const searchParamStringsArray = getSearchParamsStringsArray(searchParams, [
      "filters",
    ]);

    if (rating === selectedRating) {
      const newFilters = filters
        ?.split("|")
        .filter((filter) => filter.split("-")[0] !== "avgRating")
        .join("|");

      if (newFilters) searchParamStringsArray.push(`filters=${newFilters}`);
    } else {
      let newFilters: any;
      if (isNaN(selectedRating)) {
        newFilters = [
          ...(filters?.split("|") || []),
          `avgRating-${rating}`,
        ].join("|");
      } else {
        newFilters = filters
          ?.split("|")
          .map((filter) => {
            if (filter.split("-")[0] === "avgRating") {
              return `avgRating-${rating}`;
            }

            return filter;
          })
          .join("|");
      }

      searchParamStringsArray.push(`filters=${newFilters}`);
    }

    router.push(`${pathname}?${searchParamStringsArray.join("&")}`);
  };

  return (
    <div className="mb-9 w-full">
      <div className="space-y-0">
        {[5, 4, 3, 2, 1].map((rating) => (
          <button
            key={rating}
            onClick={() => handleClick(rating)}
            className={cn(
              `flex w-full items-center justify-between rounded-md p-2 transition-colors hover:bg-gray-200`,
              selectedRating === rating && "bg-gray-200",
            )}
          >
            <div className="flex items-center">
              {[...Array(rating)].map((_, index) => (
                <Star key={index} className="h-4 w-4 fill-current text-black" />
              ))}
              {[...Array(5 - rating)].map((_, index) => (
                <Star key={index + rating} className="h-4 w-4 text-gray-300" />
              ))}
            </div>
            <span className="text-sm font-medium text-gray-700">
              {rating} {rating === 1 ? "star" : "stars"} & up
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
