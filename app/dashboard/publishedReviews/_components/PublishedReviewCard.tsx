"use client";
import { useState } from "react";

import Image from "next/image";

import { format } from "date-fns";
import { Avatar } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { ProductImage } from "@/app/_components/ProductImage";
import { ChevronDown, ChevronUp, Star, Store } from "lucide-react";

import { RatingAndReview, RatingAndReviewProduct } from "@prisma/client";
import { routes } from "@/app/_config/routes";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const MAX_TEXT_LENGTH = 250;

interface PublishedReviewCardProps {
  publishedReview: RatingAndReview & {
    productInformation: RatingAndReviewProduct;
  };
}

export const PublishedReviewCard = ({
  publishedReview,
}: PublishedReviewCardProps) => {
  const [isAnsExpanded, setIsAnsExpanded] = useState(false);
  const [isRevExpanded, setIsRevExpanded] = useState(false);

  return (
    <Card className="w-full">
      <CardContent className="p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link href={routes.productDetails(publishedReview.productId)}>
              <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded sm:h-16 sm:w-16">
                <ProductImage
                  src={publishedReview.productInformation.image}
                  fill
                />
              </div>
            </Link>

            <div>
              <Link href={routes.productDetails(publishedReview.productId)}>
                <p className="text-sm font-medium text-muted-foreground">
                  {publishedReview.productInformation.name}
                </p>
              </Link>

              <p className="text-xs text-muted-foreground">
                {format(new Date(publishedReview.createdAt), "MMM dd, yyyy")}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex items-center">
              <Star className="h-4 w-4 fill-primary text-primary" />
              <span className="ml-1 text-sm font-medium">
                {publishedReview.rating}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-3 flex flex-col items-start gap-1">
          <p className="text-ellipsis text-sm">
            {isRevExpanded
              ? publishedReview.review
              : publishedReview.review?.slice(0, MAX_TEXT_LENGTH)}
          </p>

          {(publishedReview.review?.length || 0) > MAX_TEXT_LENGTH && (
            <Button
              variant="link"
              className="h-auto p-0 font-normal text-primary"
              onClick={() => setIsRevExpanded(!isRevExpanded)}
            >
              {isRevExpanded ? (
                <>
                  <ChevronUp className="mr-1 h-4 w-4" />
                  Show less
                </>
              ) : (
                <>
                  <ChevronDown className="mr-1 h-4 w-4" />
                  Read more
                </>
              )}
            </Button>
          )}
        </div>

        <div className="mt-3 flex space-x-2 overflow-x-auto scrollbar-none">
          {publishedReview.reviewImages.map((img) => (
            <Image
              key={img}
              width="72"
              height="72"
              alt={`i`}
              src={`/placeholder.svg?height=64&width=64&text=Image+${img}`}
              className="h-16 w-16 flex-shrink-0 rounded-md bg-green-100 object-cover"
              style={{
                aspectRatio: "1/1",
                objectFit: "cover",
              }}
            />
          ))}
        </div>

        {publishedReview.answer && (
          <div className="mt-2 rounded-md bg-gray-50 p-3">
            <div className="mb-2 flex items-center space-x-3">
              <Avatar className="flex h-6 w-6 items-center justify-center bg-primary">
                <Store className="h-4 w-4 text-primary-foreground" />
              </Avatar>
              <p className="text-sm font-medium text-muted-foreground">
                Store Response
              </p>
            </div>

            <div className="flex flex-col items-start gap-1">
              <p className={`text-sm`}>
                {isAnsExpanded
                  ? publishedReview.answer
                  : publishedReview.answer?.slice(0, MAX_TEXT_LENGTH)}
              </p>

              {publishedReview.answer.length > MAX_TEXT_LENGTH && (
                <Button
                  variant="link"
                  className="h-auto p-0 font-normal text-primary"
                  onClick={() => setIsAnsExpanded(!isAnsExpanded)}
                >
                  {isAnsExpanded ? (
                    <>
                      <ChevronUp className="mr-1 h-4 w-4" />
                      Show less
                    </>
                  ) : (
                    <>
                      <ChevronDown className="mr-1 h-4 w-4" />
                      Read more
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
