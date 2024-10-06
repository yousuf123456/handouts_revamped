"use server";

import prisma from "@/app/_libs/prismadb";
import { ActionResult } from "@/app/_types";
import { userAuthentication } from "@/app/_serverFunctions/userAuthentication";
import { revalidateTag } from "next/cache";
import { userCartCache } from "@/app/_config/cache";

export const updateCartItemQuantity = async ({
  cartItemId,
  isIncrement,
}: {
  cartItemId: string;
  isIncrement: boolean;
}): Promise<ActionResult> => {
  try {
    const { isUserAuthenticated, dbUserId } = userAuthentication();

    if (!isUserAuthenticated || !dbUserId)
      return {
        success: false,
        message: "Unauthenticated",
      };

    await prisma.cartItem.update({
      where: { id: cartItemId },
      data: {
        quantity: {
          ...(isIncrement ? { increment: 1 } : { decrement: 1 }),
        },
      },
    });

    userCartCache.revalidate(dbUserId);

    return {
      success: true,
      message: "Successfully updated product quantity.",
    };
  } catch (e) {
    console.log(e);
    return {
      success: false,
      message: "Something went wrong.",
    };
  }
};
