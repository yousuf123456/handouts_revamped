"use server";
import prisma from "@/app/_libs/prismadb";

import { ActionResult } from "@/app/_types";
import { userCartCache } from "../_config/cache";
import { userAuthentication } from "@/app/_serverFunctions/userAuthentication";

export const addToCart = async ({
  selectedCombinationId,
  productId,
  quantity,
}: {
  quantity: number;
  productId: string;
  selectedCombinationId?: string | null;
}): Promise<ActionResult> => {
  try {
    const { isUserAuthenticated, dbUserId } = userAuthentication();

    if (!isUserAuthenticated || !dbUserId)
      return {
        success: false,
        message: "Unauthenticated",
      };

    const existingUserCartItem = await prisma.cartItem.findUnique({
      where: {
        userId_productId: {
          userId: dbUserId,
          productId,
        },
      },
    });

    if (existingUserCartItem) {
      // Changing it to null so it matches with prisma type for equality in below condition
      if (selectedCombinationId === undefined) selectedCombinationId = null;

      if (
        existingUserCartItem.quantity === quantity &&
        existingUserCartItem.selectedCombinationId === selectedCombinationId
      )
        return {
          success: false,
          message: "This product already exists in your cart.",
        };

      await prisma.cartItem.update({
        where: {
          userId_productId: {
            productId,
            userId: dbUserId,
          },
        },
        data: {
          quantity,
          selectedCombinationId,
        },
      });

      userCartCache.revalidate(dbUserId);

      return {
        success: true,
        message: "Successfully added the product to your cart.",
      };
    }

    await prisma.cartItem.create({
      data: {
        quantity,
        productId,
        userId: dbUserId,
        selectedCombinationId,
      },
    });

    userCartCache.revalidate(dbUserId);

    return {
      success: true,
      message: "Successfully added the product to your cart.",
    };
  } catch (e) {
    console.log(e);
    return {
      success: false,
      message: "Something went wrong.",
    };
  }
};
