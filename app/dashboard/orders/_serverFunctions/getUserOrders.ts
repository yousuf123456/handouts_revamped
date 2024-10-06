import { unstable_cache } from "next/cache";
import prisma from "@/app/_libs/prismadb";
import { userAuthentication } from "@/app/_serverFunctions/userAuthentication";

import { PaginationParams } from "@/app/_types";
import { calculateItemsToSkip } from "@/app/_utils";
import { USER_ORDERS_PER_PAGE } from "@/app/_config/pagination";
import { Order, OrderedProduct, Package } from "@prisma/client";
import { userOrdersCache } from "@/app/_config/cache";

export type UserOrder = Order & {
  packages: (Package & { orderedProducts: OrderedProduct[] })[];
};

type getUserOrdersParams = PaginationParams & {
  dbUserId: string;
};

export const getUserOrders = async ({
  page,
  dbUserId,
}: getUserOrdersParams): Promise<{
  userOrders: UserOrder[];
  totalCount: number;
}> => {
  console.log("HEllo I am executed");
  const itemsToSkip = calculateItemsToSkip(page || 1, USER_ORDERS_PER_PAGE);

  const [userOrders, totalCount] = await prisma.$transaction([
    prisma.order.findMany({
      orderBy: {
        id: "desc",
      },
      where: {
        customerId: dbUserId,
      },
      include: {
        packages: {
          include: {
            orderedProducts: true,
          },
        },
      },
      skip: itemsToSkip,
      take: USER_ORDERS_PER_PAGE,
    }),
    prisma.order.count({ where: { customerId: dbUserId } }),
  ]);

  return { userOrders, totalCount };
};
