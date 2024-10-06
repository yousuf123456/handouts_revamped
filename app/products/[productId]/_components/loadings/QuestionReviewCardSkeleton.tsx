import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const QuestionReviewCardSkeleton = () => {
  return (
    <Card className="w-full">
      <CardContent className="p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Skeleton className=" h-7 w-7 rounded-full" />
            <Skeleton className="h-6 w-28" />
          </div>
          <Skeleton className="h-6 w-16" />
        </div>

        <Skeleton className="mt-3 h-16 w-full" />
      </CardContent>
    </Card>
  );
};
