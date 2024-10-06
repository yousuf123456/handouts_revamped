import React, { Suspense } from "react";

import prisma from "@/app/_libs/prismadb";
import Link from "next/link";

import { ChevronLeft } from "lucide-react";
import { routes } from "@/app/_config/routes";
import { PaginationParams } from "@/app/_types";
import { buttonVariants } from "@/components/ui/button";
import { SortControl } from "@/app/_components/SortControl";
import { PRODUCTS_REVIEWS_PER_PAGE } from "@/app/_config/pagination";
import { PaginationControl } from "@/app/_components/PaginationControl";
import { ProductReviewsList } from "../../_components/ProductReviewsList";
import { RatingDistribution as RatingDistributionType } from "@prisma/client";

import { RatingDistribution } from "./RatingDistribution";
import { QuestionReviewCardSkeleton } from "../../_components/loadings/QuestionReviewCardSkeleton";
import { FilterControl } from "@/app/_components/FilterControl";

type ProductReviewsProps = PaginationParams & {
  productId: string;
};

export const ProductReviews = async ({
  page,
  filter,
  productId,
  ...paginationParams
}: ProductReviewsProps) => {
  const productInfo = await prisma.product.findUnique({
    where: {
      id: productId,
    },
    select: {
      name: true,
      storeId: true,
      ratingsSum: true,
      ratingsCount: true,
      detailedRatingsCount: true,
    },
  });

  if (!productInfo) return "No Product Found";

  const sortItems: Parameters<typeof SortControl>[0]["sortItems"] = [
    {
      label: "Newest",
      isDefault: true,
      value: "_id-desc",
    },
    {
      label: "Highest Rated",
      value: "rating-desc",
    },
    {
      label: "Lowest Rated",
      value: "rating-asc",
    },
  ];

  const filterItems: Parameters<typeof FilterControl>[0]["filterItems"] = [
    {
      isDefault: true,
      label: "All Ratings",
      value: "rating-all",
    },
    {
      label: "5 Stars",
      value: "rating-5",
    },
    {
      label: "4 Stars",
      value: "rating-4",
    },
    {
      label: "3 Stars",
      isDefault: true,
      value: "rating-3",
    },
    {
      label: "2 Stars",
      value: "rating-2",
    },
    {
      label: "1 Stars",
      value: "rating-1",
    },
  ];

  const totalReviewsCount = filter
    ? productInfo.detailedRatingsCount[
        filter.split("-")[1] as unknown as keyof RatingDistributionType
      ]
    : productInfo.ratingsCount;

  return (
    <div className="flex flex-col gap-12">
      <div className="flex items-center justify-between">
        <h1 className="mr-4 flex-grow truncate text-lg font-medium uppercase text-black sm:text-xl md:text-2xl">
          {productInfo.name}
        </h1>

        <Link
          href={`${routes.productDetails(productId)}`}
          className={buttonVariants({
            variant: "ghost",
            className: "flex items-center text-end text-xs sm:text-sm",
          })}
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back to Product
        </Link>
      </div>

      <RatingDistribution
        ratingsSum={productInfo.ratingsSum}
        ratingsCount={productInfo.ratingsCount}
        ratingDistribution={productInfo.detailedRatingsCount}
      />

      <div className="flex flex-col gap-8">
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <h2 className="text-lg font-semibold sm:text-xl">All Reviews</h2>
          <div className="flex flex-col space-y-2 sm:flex-row sm:space-x-4 sm:space-y-0">
            <SortControl sortItems={sortItems} />
            <FilterControl filterItems={filterItems} />
          </div>
        </div>

        <Suspense
          key={page || 1}
          fallback={
            <div className="flex flex-col gap-5">
              <QuestionReviewCardSkeleton />
              <QuestionReviewCardSkeleton /> <QuestionReviewCardSkeleton />
            </div>
          }
        >
          <ProductReviewsList
            page={page}
            filter={filter}
            {...paginationParams}
            productId={productId}
            storeId={productInfo.storeId}
          />
        </Suspense>

        <div className="mx-auto">
          <PaginationControl
            totalCount={totalReviewsCount}
            itemsPerPage={PRODUCTS_REVIEWS_PER_PAGE}
          />
        </div>
      </div>
    </div>
  );
};
