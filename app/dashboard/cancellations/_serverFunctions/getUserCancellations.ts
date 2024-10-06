import prisma from "@/app/_libs/prismadb";

import { PaginationParams } from "@/app/_types";
import { calculateItemsToSkip } from "@/app/_utils";
import { userAuthentication } from "@/app/_serverFunctions/userAuthentication";
import { USER_CANCELLATIONS_PER_PAGE } from "@/app/_config/pagination";
import { CancellationRequest, OrderedProduct } from "@prisma/client";

export type UserCancellation = CancellationRequest & {
  orderedProducts: OrderedProduct[];
};

type getUserCancellationsParams = PaginationParams & { dbUserId: string };

export const getUserCancellations = async ({
  page,
  dbUserId,
}: getUserCancellationsParams): Promise<{
  userCancellations: UserCancellation[];
  totalCount: number;
}> => {
  const itemsToSkip = calculateItemsToSkip(
    page || 1,
    USER_CANCELLATIONS_PER_PAGE,
  );

  const [userCancellations, totalCount] = await prisma.$transaction([
    prisma.cancellationRequest.findMany({
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
      take: USER_CANCELLATIONS_PER_PAGE,
    }),
    prisma.cancellationRequest.count({ where: { requesterId: dbUserId } }),
  ]);

  return { userCancellations, totalCount };
};
