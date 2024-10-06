import React from "react";
import { CardContent, Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const PublishedReviewSkeleton = () => {
  return (
    <Card className="w-full">
      <CardContent className="p-3">
        <div className="flex w-full items-center justify-between gap-4">
          <div className="flex w-full items-center gap-4">
            <Skeleton className="h-12 w-12 flex-shrink-0 sm:h-16 sm:w-16" />
            <Skeleton className="h-7 w-32" />
          </div>
          <Skeleton className="h-7 w-14" />
        </div>
        <Skeleton className="mt-4 h-20 w-full" />
      </CardContent>
    </Card>
  );
};
