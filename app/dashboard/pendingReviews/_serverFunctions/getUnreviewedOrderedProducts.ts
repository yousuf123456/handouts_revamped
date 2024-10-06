import prisma from "@/app/_libs/prismadb";
import { PaginationParams } from "../../../_types/index";

import { calculateItemsToSkip } from "@/app/_utils";
import { USER_REVIEWS_PER_PAGE } from "@/app/_config/pagination";

export const getUnreviewedOrderedProducts = async ({
  page,
  dbUserId,
}: PaginationParams & {
  dbUserId: string;
}) => {
  const itemsToSkip = calculateItemsToSkip(page || 1, USER_REVIEWS_PER_PAGE);

  const [totalCount, unreviewedOrderedProducts] = await prisma.$transaction([
    prisma.orderedProduct.count({
      where: {
        status: "Delievered",
        hasBeenReviewed: false,
        customerId: dbUserId,
      },
    }),
    prisma.orderedProduct.findMany({
      where: {
        status: "Delievered",
        hasBeenReviewed: false,
        customerId: dbUserId,
      },
      skip: itemsToSkip,
      take: USER_REVIEWS_PER_PAGE,
    }),
  ]);

  return { totalCount, unreviewedOrderedProducts };
};
