import React, { Suspense } from "react";

import Link from "next/link";
import prisma from "@/app/_libs/prismadb";
import { ChevronLeft } from "lucide-react";
import { routes } from "@/app/_config/routes";
import { PaginationParams } from "@/app/_types";
import { buttonVariants } from "@/components/ui/button";
import { SortControl } from "@/app/_components/SortControl";
import AskQuestionForm from "../../_components/AskQuestionForm";
import { PRODUCTS_QUESTIONS_PER_PAGE } from "@/app/_config/pagination";
import { PaginationControl } from "@/app/_components/PaginationControl";
import { ProductQuestionsList } from "../../_components/ProductQuestionsList";
import { QuestionReviewCardSkeleton } from "../../_components/loadings/QuestionReviewCardSkeleton";

type ProductQuestionsProps = PaginationParams & {
  productId: string;
};

export const ProductQuestions = async ({
  page,
  productId,
  ...paginationParams
}: ProductQuestionsProps) => {
  const productInfo = await prisma.product.findUnique({
    where: {
      id: productId,
    },
    select: {
      name: true,
      image: true,
      storeId: true,
      questionsCount: true,
    },
  });

  if (!productInfo) return "Product not found.";

  const sortItems: Parameters<typeof SortControl>[0]["sortItems"] = [
    {
      label: "Newest",
      value: "_id-desc",
      isDefault: true,
    },
    {
      label: "Oldest",
      value: "_id-asc",
    },
  ];

  return (
    <div className="flex flex-col gap-12">
      <div className="flex items-center justify-between">
        <h1 className="mr-4 flex-grow truncate  text-lg font-medium uppercase text-black sm:text-xl md:text-2xl">
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

      <div className="mx-auto w-full max-w-lg">
        <AskQuestionForm
          productId={productId}
          storeId={productInfo.storeId}
          productInformation={{
            image: productInfo.image,
            name: productInfo.name,
          }}
        />
      </div>

      <div className="flex flex-col gap-8">
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <h2 className="text-lg font-semibold sm:text-xl">All Questions</h2>
          <SortControl sortItems={sortItems} />
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
          <ProductQuestionsList
            page={page}
            {...paginationParams}
            productId={productId}
            storeId={productInfo.storeId}
          />
        </Suspense>

        <div className="mx-auto">
          <PaginationControl
            totalCount={productInfo.questionsCount}
            itemsPerPage={PRODUCTS_QUESTIONS_PER_PAGE}
          />
        </div>
      </div>
    </div>
  );
};
