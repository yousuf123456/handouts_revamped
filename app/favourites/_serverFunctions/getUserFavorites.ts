import prisma from "@/app/_libs/prismadb";

export const getUserFavorites = async ({ dbUserId }: { dbUserId: string }) => {
  const userFavorites = await prisma.product.findMany({
    where: {
      favouritedByIds: {
        hasSome: [dbUserId],
      },
    },
    select: {
      id: true,
      name: true,
      image: true,
      price: true,
      storeId: true,
      storeName: true,
      promoPrice: true,
      combinations: true,
      favouritedByIds: true,
      promoPriceEndingDate: true,
      promoPriceStartingDate: true,
    },
  });

  return userFavorites;
};
