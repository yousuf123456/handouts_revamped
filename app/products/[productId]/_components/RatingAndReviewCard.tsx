"use client";
import { useState } from "react";

import Image from "next/image";

import { RatingAndReview } from "@prisma/client";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown, ChevronUp, Star, Store } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const MAX_TEXT_LENGTH = 250;

interface RatingAndReviewCardProps {
  ratingAndReview: Pick<
    RatingAndReview,
    | "id"
    | "answer"
    | "rating"
    | "review"
    | "createdAt"
    | "answeredAt"
    | "reviewImages"
    | "userInformation"
  > & {
    [key: string]: any;
  };
}

export function RatingAndReviewCard({
  ratingAndReview,
}: RatingAndReviewCardProps) {
  const [isAnsExpanded, setIsAnsExpanded] = useState(false);
  const [isRevExpanded, setIsRevExpanded] = useState(false);

  return (
    <Card className="w-full">
      <CardContent className="p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-7 w-7">
              <AvatarImage
                asChild
                src={ratingAndReview.userInformation.image || undefined}
              >
                <Image
                  src={ratingAndReview.userInformation.image || ""}
                  alt="User Profile"
                  fill
                />
              </AvatarImage>
              <AvatarFallback>
                {ratingAndReview.userInformation.name[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {ratingAndReview.userInformation.name}
              </p>
              <p className="text-xs text-muted-foreground">Aug 15, 2023</p>
            </div>
          </div>

          <div className="flex items-center">
            <Star className="h-4 w-4 fill-primary text-primary" />
            <span className="ml-1 text-sm font-medium">
              {ratingAndReview.rating}
            </span>
          </div>
        </div>

        <div className="mt-3 flex flex-col items-start gap-1">
          <p className="text-ellipsis text-sm">
            {isRevExpanded
              ? ratingAndReview.review
              : ratingAndReview.review?.slice(0, MAX_TEXT_LENGTH)}
          </p>

          {(ratingAndReview.review?.length || 0) > MAX_TEXT_LENGTH && (
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
          {ratingAndReview.reviewImages.map((img, i) => (
            <Image
              key={i}
              src={img}
              width="72"
              height="72"
              alt={`Review Image`}
              className="h-16 w-16 flex-shrink-0 rounded-md bg-green-100 object-cover"
              style={{
                aspectRatio: "1/1",
                objectFit: "cover",
              }}
            />
          ))}
        </div>

        {ratingAndReview.answer && (
          <div className="mt-2 rounded-md bg-muted p-3">
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
                  ? ratingAndReview.answer
                  : ratingAndReview.answer?.slice(0, MAX_TEXT_LENGTH)}
              </p>

              {ratingAndReview.answer.length > MAX_TEXT_LENGTH && (
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
}
