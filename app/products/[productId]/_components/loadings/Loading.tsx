import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

export const Loading = () => {
  return (
    <div className="grid grid-cols-1 gap-14 min-[960px]:grid-cols-9 min-[960px]:gap-8">
      <div className="grid gap-6 min-[960px]:col-span-5 min-[960px]:grid-cols-2">
        <Skeleton className="relative aspect-[2/2.5] w-full" />
        <Skeleton className="relative hidden aspect-[2/2.5] w-full min-[960px]:block" />
      </div>

      <div className="flex flex-col gap-5 max-[960px]:px-3 min-[960px]:col-span-4">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="mt-3 h-12 w-full" />
        <Skeleton className="h-12 w-full" />

        <div className="mt-3 flex gap-5">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>

        <Separator className="my-5 bg-slate-200" />

        <div className="grid grid-cols-4 gap-5">
          <Skeleton className="col-span-1 h-12 w-full" />
          <Skeleton className="col-span-3 h-12 w-full" />
        </div>
        <Skeleton className="h-12 w-full" />
      </div>
    </div>
  );
};
