"use server";

import prisma from "@/app/_libs/prismadb";
import { ActionResult } from "@/app/_types";
import { userCartCache } from "@/app/_config/cache";
import { userAuthentication } from "@/app/_serverFunctions/userAuthentication";

export const deleteCartItem = async ({
  cartItemId,
}: {
  cartItemId: string;
}): Promise<ActionResult> => {
  try {
    const { isUserAuthenticated, dbUserId } = userAuthentication();

    if (!isUserAuthenticated || !dbUserId)
      return {
        success: false,
        message: "Unauthenticated",
      };

    await prisma.cartItem.delete({
      where: { id: cartItemId },
    });

    userCartCache.revalidate(dbUserId);

    return {
      success: true,
      message: "Successfully deleted the product from your cart.",
    };
  } catch (e) {
    console.log(e);
    return {
      success: false,
      message: "Something went wrong.",
    };
  }
};
