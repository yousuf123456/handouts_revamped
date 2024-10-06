"use server";

import prisma from "../_libs/prismadb";

interface productClickParams {
  storeId: string;
  productId: string;
  superTokensUserId: string;
}

export const productClick = async ({
  storeId,
  productId,
  superTokensUserId,
}: productClickParams) => {
  try {
    await prisma.$transaction([
      prisma.productClick.create({
        data: {
          superTokensUserId: superTokensUserId,
          productId: productId,
          storeId: storeId,
        },
      }),

      prisma.product.update({
        where: {
          id: productId,
        },
        data: {
          clicks: {
            increment: 1,
          },
        },
      }),
    ]);

    return { success: true, message: "Incremented Product Click Succesfully." };
  } catch (e) {
    console.log("Error incrementing product click", e);
    return { success: false, message: "Something went wrong." };
  }
};
