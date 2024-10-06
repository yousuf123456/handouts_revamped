import React from "react";

import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RatingDistribution as RatingDistributionType } from "@prisma/client";

export const RatingDistribution = ({
  ratingsSum,
  ratingsCount,
  ratingDistribution,
}: {
  ratingsSum: number;
  ratingsCount: number;
  ratingDistribution: RatingDistributionType;
}) => {
  const averageRating = ratingsSum / ratingsCount;

  return (
    <Card className="mb-6 sm:mb-8">
      <CardContent className="p-4 sm:p-6">
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h2 className="mb-2 text-lg font-semibold sm:mb-0 sm:text-xl">
            Customer Reviews
          </h2>
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold sm:text-4xl">
              {averageRating.toFixed(1)}
            </span>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-4 w-4 sm:h-5 sm:w-5 ${
                    star <= Math.round(averageRating)
                      ? "fill-primary text-primary"
                      : "stroke-muted-foreground text-muted"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground sm:text-sm">
              Based on {ratingsCount} reviews
            </span>
          </div>
        </div>
        <div className="space-y-2">
          {Object.entries(ratingDistribution)
            .sort(([a], [b]) => Number(b) - Number(a))
            .map(([rating, count]) => (
              <div key={rating} className="flex items-center">
                <span className="w-10 text-xs sm:w-12 sm:text-sm">
                  {rating} stars
                </span>
                <div className="mx-2 flex-grow">
                  <Progress
                    value={(count / ratingsCount) * 100}
                    className="h-2"
                  />
                </div>
                <span className="w-8 text-right text-xs text-muted-foreground sm:w-12 sm:text-sm">
                  {((count / ratingsCount) * 100).toFixed(0)}%
                </span>
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
};
