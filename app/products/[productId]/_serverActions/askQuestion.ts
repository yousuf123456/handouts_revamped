"use server";

import { QUESTIONS_PER_BUCKET_COUNT } from "@/app/_config/pagination";
import prisma from "@/app/_libs/prismadb";

import ObjectID from "bson-objectid";
import { revalidateTag } from "next/cache";
import { ActionResult } from "@/app/_types";
import { currentUser } from "@clerk/nextjs/server";
import { QuestionProductInformation } from "@prisma/client";
import { productQuestionsCache } from "@/app/_config/cache";

interface askQuestionParameters {
  query: string;
  storeId: string;
  productId: string;
  productInformation: QuestionProductInformation;
}

export const askQuestion = async (
  params: askQuestionParameters,
): Promise<ActionResult> => {
  try {
    const { storeId, query, productId, productInformation } = params;

    const authUser = await currentUser();
    const dbUserId = authUser?.publicMetadata.dbUserId;

    if (!authUser || !authUser.id || !dbUserId)
      return {
        success: false,
        message: "Unauthenticated",
      };

    const question = {
      _id: { $oid: ObjectID().toHexString() },
      query,
      userInformation: {
        name: authUser.username || authUser.firstName,
        image: authUser.imageUrl,
      },
      userId: { $oid: dbUserId },
      createdAt: { $date: new Date().toISOString() },
    };

    await prisma.$transaction([
      prisma.product.update({
        where: {
          id: productId,
        },
        data: {
          questionsCount: {
            increment: 1,
          },
        },
      }),

      prisma.$runCommandRaw({
        findAndModify: "QuestionsBucket",
        query: {
          storeId: { $oid: storeId },
          productId: { $oid: productId },
          count: {
            $lt: QUESTIONS_PER_BUCKET_COUNT,
          },
        },
        update: {
          $push: {
            questions: question,
          },
          $inc: {
            count: 1,
          },
          $setOnInsert: {
            productInformation,
            storeId: { $oid: storeId },
            productId: { $oid: productId },
          },
        },
        upsert: true,
      }),
    ]);

    productQuestionsCache.revalidate(productId);

    return {
      success: true,
      message: "Succesfully posted a question.",
    };
  } catch (e) {
    return {
      success: false,
      message: "Something went wrong.",
    };
  }
};
