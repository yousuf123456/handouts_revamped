import React from "react";
import { unstable_cache } from "next/cache";

import { QuestionCard } from "./QuestionCard";
import { productQuestionsCache } from "@/app/_config/cache";
import { getProductQuestions } from "../customer-questions/_serverFunctions/getProductQuestions";

type ProductReviewsListProps = Parameters<typeof getProductQuestions>[0] & {
  listOnePageOnly?: boolean;
};

export const ProductQuestionsList = async ({
  page,
  productId,
  listOnePageOnly,
  ...getProductReviewsParams
}: ProductReviewsListProps) => {
  const getCachedProductQuestions = unstable_cache(
    getProductQuestions,
    productQuestionsCache.keys,
    {
      tags: productQuestionsCache.tags(productId),
      revalidate: productQuestionsCache.revalidateDuration,
    },
  );

  const productQuestions = await getCachedProductQuestions({
    ...getProductReviewsParams,
    productId,
    page,
  });

  return (
    <div className="flex flex-col gap-5">
      {productQuestions.map((question, i) => (
        <QuestionCard key={i} question={question} />
      ))}
    </div>
  );
};
