import prisma from "@/app/_libs/prismadb";
import { mapMongoToPrisma } from "../../../../_utils/formatingUtils";

import {
  PRODUCTS_QUESTIONS_PER_PAGE,
  QUESTIONS_PER_BUCKET_COUNT,
} from "@/app/_config/pagination";

import { PipelineStage } from "mongoose";
import { getPaginatedBucketPipeline } from "@/app/products/[productId]/_utils/getPaginatedBucketPipeline";

import { Question } from "@prisma/client";
import { PaginationParams } from "@/app/_types";

type Parameters = Partial<PaginationParams> & {
  storeId: string;
  productId: string;
};

export const getProductQuestions = async (params: Parameters) => {
  const { productId, storeId, ...paginationParams } = params;

  if (!productId || !storeId) return [];

  const pipeline: PipelineStage[] = [
    {
      $match: {
        storeId: { $oid: storeId },
      },
    },
  ];

  const paginatedPipeline = getPaginatedBucketPipeline(pipeline, {
    ...paginationParams,
    itemsFieldName: "questions",
    ITEMS_PER_PAGE: PRODUCTS_QUESTIONS_PER_PAGE,
    ITEMS_PER_BUCKET_COUNT: QUESTIONS_PER_BUCKET_COUNT,
  });

  const questionsBucketsArray = (await prisma.questionsBucket.aggregateRaw({
    pipeline: paginatedPipeline as any[],
  })) as any;

  // Extracting questions from buckets
  const questions = questionsBucketsArray?.flatMap(
    (productQuestionBucket: any) =>
      Array.isArray(productQuestionBucket.questions) // Check to see if the items array was unwinded
        ? productQuestionBucket.questions // Return items array if it was not unwinded if
        : [productQuestionBucket.questions], // Return an array of the individual unwinded item
  );

  return mapMongoToPrisma(questions) as Question[];
};
