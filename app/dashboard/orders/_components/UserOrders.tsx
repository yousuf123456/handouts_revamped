import React from "react";

import { unstable_cache } from "next/cache";
import { userOrdersCache } from "@/app/_config/cache";

import { OrderCard } from "./OrderCard";
import { PaginationParams } from "@/app/_types";
import { USER_ORDERS_PER_PAGE } from "@/app/_config/pagination";
import { getUserOrders } from "../_serverFunctions/getUserOrders";
import { userAuthentication } from "@/app/_serverFunctions/userAuthentication";
import { PaginationControl } from "@/app/_components/PaginationControl";
import { EmptyState } from "@/app/_components/EmptyState";
import { ShoppingBag } from "lucide-react";
import { routes } from "@/app/_config/routes";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function fakeDelay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

type UserOrdersProps = PaginationParams;

export const UserOrders = async (props: UserOrdersProps) => {
  const { dbUserId, isUserAuthenticated } = userAuthentication();

  if (!dbUserId || !isUserAuthenticated) return <p>Unauthenticated</p>;

  const { userOrders, totalCount } = await unstable_cache(
    getUserOrders,
    userOrdersCache.keys,
    {
      tags: userOrdersCache.tags(dbUserId),
      revalidate: userOrdersCache.duration,
    },
  )({
    dbUserId,
    ...props,
  });

  if (userOrders.length === 0)
    return (
      <EmptyState
        Icon={ShoppingBag}
        heading="No Orders Placed"
        actionLabel="Place your order now and enjoy seamless delivery right to your doorstep!"
      >
        <Link href={routes.home}>
          <Button size={"lg"} variant={"corners"} className="w-full uppercase">
            Shop
          </Button>
        </Link>
      </EmptyState>
    );

  return (
    <div className="flex flex-col gap-5">
      {userOrders.map((userOrder, i) => (
        <OrderCard userOrder={userOrder} key={i} />
      ))}

      <div className="mx-auto mt-6">
        <PaginationControl
          totalCount={totalCount}
          itemsPerPage={USER_ORDERS_PER_PAGE}
        />
      </div>
    </div>
  );
};
