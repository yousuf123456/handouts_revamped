import prisma from "../_libs/prismadb";

// Get dbUserId as parameter because getting headers (used in auth) is not supported in cache scope
export const getUserCart = async ({ dbUserId }: { dbUserId: string }) => {
  const userCartItems = await prisma.cartItem.findMany({
    where: {
      userId: dbUserId,
    },
    include: {
      product: {
        select: {
          id: true,
          name: true,
          image: true,
          price: true,
          storeId: true,
          category: true,
          storeName: true,
          promoPrice: true,
          combinations: true,
          favouritedByIds: true,
          promoPriceEndingDate: true,
          promoPriceStartingDate: true,
        },
      },
    },
  });

  return userCartItems;
};
