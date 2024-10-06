import prisma from "@/app/_libs/prismadb";

import { PaginationParams } from "@/app/_types";
import { calculateItemsToSkip } from "@/app/_utils";
import { STORE_PRODUCTS_PER_PAGE } from "@/app/_config/pagination";

type getStoreProductsParams = PaginationParams & {
  storeId: string;
};

export const getStoreProducts = async ({
  page,
  storeId,
}: getStoreProductsParams) => {
  const itemsToSkip = calculateItemsToSkip(page || 1, STORE_PRODUCTS_PER_PAGE);

  const [storeProducts, totalCount] = await prisma.$transaction([
    prisma.product.findMany({
      where: {
        storeId,
      },
      select: {
        id: true,
        name: true,
        image: true,
        price: true,
        avgRating: true,
        attributes: true,
        detailedImages: true,
        categoryTreeData: true,
        superTokensUserId: true,
      },
      take: STORE_PRODUCTS_PER_PAGE,
      skip: itemsToSkip,
    }),
    prisma.product.count({
      where: {
        storeId,
      },
    }),
  ]);

  return { storeProducts, totalCount };
};
