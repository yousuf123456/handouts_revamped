import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export const OrderCardSkeleton = () => {
  return (
    <Card className="w-full">
      <CardContent className="space-y-8 p-4">
        <div className="flex items-center justify-between gap-4">
          <Skeleton className="h-10 w-56" />
          <Skeleton className="h-10 w-20" />
        </div>

        <Skeleton className="h-24 w-full" />
      </CardContent>
    </Card>
  );
};
