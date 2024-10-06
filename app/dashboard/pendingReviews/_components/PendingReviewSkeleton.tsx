import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const PendingReviewSkeleton = () => {
  return (
    <Card className="w-full">
      <CardContent className="space-y-8 p-6">
        <Skeleton className="h-24 w-full" />

        <Skeleton className="h-11 w-full" />
      </CardContent>
    </Card>
  );
};
