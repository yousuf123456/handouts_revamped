import prisma from "@/app/_libs/prismadb";

import { PaginationParams } from "@/app/_types";
import { calculateItemsToSkip } from "@/app/_utils";
import { userAuthentication } from "@/app/_serverFunctions/userAuthentication";
import { USER_RETURNS_PER_PAGE } from "@/app/_config/pagination";
import { OrderedProduct, ReturnRequest } from "@prisma/client";

export type UserReturn = ReturnRequest & {
  orderedProducts: OrderedProduct[];
};

type getUserReturnsParams = PaginationParams & { dbUserId: string };

export const getUserReturns = async ({
  page,
  dbUserId,
}: getUserReturnsParams): Promise<{
  userReturns: UserReturn[];
  totalCount: number;
}> => {
  const itemsToSkip = calculateItemsToSkip(page || 1, USER_RETURNS_PER_PAGE);

  const [userReturns, totalCount] = await prisma.$transaction([
    prisma.returnRequest.findMany({
      orderBy: {
        id: "desc",
      },
      where: {
        requesterId: dbUserId,
      },
      include: {
        orderedProducts: true,
      },
      skip: itemsToSkip,
      take: USER_RETURNS_PER_PAGE,
    }),
    prisma.returnRequest.count({ where: { requesterId: dbUserId } }),
  ]);

  return { userReturns, totalCount };
};
