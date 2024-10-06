"use server";

import prisma from "@/app/_libs/prismadb";
import { ActionResult } from "@/app/_types";
import getDBUser from "@/app/_serverActions/getDBUser";
import { revalidateTag } from "next/cache";
import {
  userCartCache,
  userFavoritesCache,
  userRecordCache,
} from "../_config/cache";

export const addToFavorites = async ({
  productId,
}: {
  productId: string;
}): Promise<ActionResult> => {
  try {
    const { user, auth } = await getDBUser();

    if (!auth.userId || !auth.sessionId || !user)
      return {
        success: false,
        message: "Unauthenticated",
      };

    const alreadyInFavorites = user.favouriteItemIds.some(
      (favId) => favId === productId,
    );

    if (alreadyInFavorites)
      return {
        success: false,
        message: "Product is already in your favorites..",
      };

    await prisma.product.update({
      where: { id: productId },
      data: {
        favouritedBy: {
          connect: {
            id: user.id,
          },
        },
      },
    });

    userCartCache.revalidate(user.id); // Revalidating user cached cart data to ensure the latest cart products are shown
    userRecordCache.revalidate(user.id); // Revalidating user record cache to ensure the latest user db object is returned as favoriteItemIds field changes here
    userFavoritesCache.revalidate(user.id); // Revalidating user cached favorites products data to ensure the latest favorite products are shown

    return {
      success: true,
      message: "Successfully added this product to your favourites.",
    };
  } catch (e) {
    console.log(e);
    return {
      success: false,
      message: "Something went wrong.",
    };
  }
};
