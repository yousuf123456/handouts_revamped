import React from "react";
import { cn } from "../_utils/cn";
import { Skeleton } from "@/components/ui/skeleton";

export const ProductCardSkeleton = ({
  dynamic,
  className,
}: {
  dynamic?: boolean;
  className?: string;
}) => {
  return (
    <div>
      <div
        className={cn(
          "flex flex-col gap-2",
          dynamic ? "w-full" : "w-[180px] sm:w-52 lg:w-64",
        )}
      >
        <div
          className={cn(
            "relative pb-2",
            dynamic ? "aspect-1 w-full" : "h-[180px] sm:h-52 lg:h-64 ",
          )}
        >
          <Skeleton className={cn("h-full w-full", className)} />
        </div>

        <Skeleton className={cn("mt-3 h-10 w-full", className)} />
        <Skeleton className={cn("h-10 w-full", className)} />
      </div>
    </div>
  );
};
