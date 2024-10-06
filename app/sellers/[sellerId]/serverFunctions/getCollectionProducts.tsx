import { STORE_PRODUCTS_PER_PAGE } from "@/app/_config/pagination";
import prisma from "@/app/_libs/prismadb";
import { PaginationParams } from "@/app/_types";
import { calculateItemsToSkip } from "@/app/_utils";

type getCollectionProductsParams = PaginationParams & {
  productsCollectionId: string;
  storeId: string;
};

export const getCollectionProducts = async ({
  page,
  storeId,
  productsCollectionId,
}: getCollectionProductsParams) => {
  const itemsToSkip = calculateItemsToSkip(page || 1, STORE_PRODUCTS_PER_PAGE);

  const [collectionProducts, totalCount] = await prisma.$transaction([
    prisma.product.findMany({
      where: {
        storeId,
        productCollectionIds: {
          has: productsCollectionId,
        },
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
        productCollectionIds: { has: productsCollectionId },
      },
    }),
  ]);

  return { collectionProducts, totalCount };
};
