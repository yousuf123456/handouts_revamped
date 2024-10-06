"use server";

import prisma from "../_libs/prismadb";

import getDBUser from "./getDBUser";
import { ActionResult } from "../_types";
import { BrowsingHistoryProduct } from "@prisma/client";
import { revalidateTag } from "next/cache";
import { userRecordCache } from "../_config/cache";

interface addBrowsingHistoryParams {
  product: BrowsingHistoryProduct;
}

export const addBrowsingHistory = async ({
  product,
}: addBrowsingHistoryParams): Promise<ActionResult> => {
  try {
    const { user } = await getDBUser({
      includeFields: { browsingHistory: true },
    });

    if (!user)
      return {
        success: false,
        message: "Unauthenticated",
      };

    const existingProductIds = user.browsingHistory.map((p) => p.id);
    if (existingProductIds.includes(product.id))
      return {
        success: false,
        message: "Product already exists in browsing history.",
      };

    let updatedBrowsingHistory = user.browsingHistory;
    updatedBrowsingHistory.push(product);

    if (user.browsingHistory.length >= 20) updatedBrowsingHistory.shift();

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        //@ts-ignore
        browsingHistory: updatedBrowsingHistory,
      },
    });

    userRecordCache.revalidate(user.id);

    return {
      success: true,
      message: "Succesfully added the product to browsing history.",
    };
  } catch (e) {
    console.log("Error in adding product to browsing history.", e);
    return { success: false, message: "Something went wrong." };
  }
};
