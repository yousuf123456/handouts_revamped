import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export const OrderDetailsSkeleton = () => {
  return (
    <div className="flex flex-col gap-6">
      <Card className="w-full">
        <CardContent className="p-5">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Skeleton className="h-8 w-full max-w-sm" />
            <Skeleton className="h-8 w-full max-w-sm" />
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6 mt-4 w-full">
        <CardHeader>
          <div className="flex items-center justify-between gap-5">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-8 w-20" />
          </div>
        </CardHeader>
        <CardContent className="mt-4 space-y-6">
          <Skeleton className="h-3 w-full" />

          <Skeleton className="h-24 w-full" />
        </CardContent>
      </Card>
    </div>
  );
};
