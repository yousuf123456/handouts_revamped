"use server";

import prisma from "@/app/_libs/prismadb";
import { ActionResult } from "@/app/_types";
import { userAuthentication } from "@/app/_serverFunctions/userAuthentication";
import { revalidateTag } from "next/cache";
import { userCartCache, userFavoritesCache } from "@/app/_config/cache";
// import { revalidateTag } from "next/cache";

export const deleteFavoriteItem = async ({
  favoriteItemId,
}: {
  favoriteItemId: string;
}): Promise<ActionResult> => {
  try {
    const { isUserAuthenticated, dbUserId } = userAuthentication();

    if (!isUserAuthenticated || !dbUserId)
      return {
        success: false,
        message: "Unauthenticated",
      };

    await prisma.product.update({
      where: {
        id: favoriteItemId,
      },
      data: {
        favouritedBy: {
          disconnect: {
            id: dbUserId,
          },
        },
      },
    });

    userCartCache.revalidate(dbUserId);
    userFavoritesCache.revalidate(dbUserId);

    return {
      success: true,
      message: "Successfully deleted the product from your favorites.",
    };
  } catch (e) {
    console.log(e);
    return {
      success: false,
      message: "Something went wrong.",
    };
  }
};
