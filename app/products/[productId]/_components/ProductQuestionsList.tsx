import React from "react";
import { unstable_cache } from "next/cache";

import { QuestionCard } from "./QuestionCard";
import { productQuestionsCache } from "@/app/_config/cache";
import { getProductQuestions } from "../customer-questions/_serverFunctions/getProductQuestions";
import { EmptyState } from "@/app/_components/EmptyState";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { routes } from "@/app/_config/routes";
import { HelpCircle } from "lucide-react";

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

  if (productQuestions.length === 0)
    return (
      <EmptyState
        Icon={HelpCircle}
        heading="No Questions"
        actionLabel="Be the first to ask a question about this product—no questions yet!"
      />
    );

  return (
    <div className="flex flex-col gap-5">
      {productQuestions.map((question, i) => (
        <QuestionCard key={i} question={question} />
      ))}
    </div>
  );
};
