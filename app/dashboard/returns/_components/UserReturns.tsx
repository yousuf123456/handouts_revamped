import React from "react";

import { getUserReturns } from "../_serverFunctions/getUserReturns";
import { PaginationParams } from "@/app/_types";
import { PaginationControl } from "@/app/_components/PaginationControl";
import { USER_RETURNS_PER_PAGE } from "@/app/_config/pagination";
import { ReturnCard } from "./ReturnCard";
import { unstable_cache } from "next/cache";
import { userReturnsCache } from "@/app/_config/cache";
import { userAuthentication } from "@/app/_serverFunctions/userAuthentication";
import { EmptyState } from "@/app/_components/EmptyState";
import { Undo2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { routes } from "@/app/_config/routes";

type UserReturnsProps = PaginationParams;

export const UserReturns = async (params: UserReturnsProps) => {
  const { dbUserId, isUserAuthenticated } = userAuthentication();

  if (!dbUserId || !isUserAuthenticated) return <p>Unauthenticated</p>;

  const { userReturns, totalCount } = await unstable_cache(
    getUserReturns,
    userReturnsCache.keys,
    {
      tags: userReturnsCache.tags(dbUserId),
      revalidate: userReturnsCache.duration,
    },
  )({ ...params, dbUserId });

  if (userReturns.length === 0)
    return (
      <EmptyState
        Icon={Undo2}
        heading="No Returns Yet"
        actionLabel="If you're not fully satisfied, you can return your order with ease—no questions asked!"
      >
        <Link href={routes.orders}>
          <Button size={"lg"} variant={"corners"} className="w-full uppercase">
            View Orders
          </Button>
        </Link>
      </EmptyState>
    );

  return (
    <div className="flex flex-col gap-5">
      {userReturns.map((userReturn, i) => (
        <ReturnCard userReturn={userReturn} key={i} />
      ))}

      <div className="mx-auto mt-6">
        <PaginationControl
          totalCount={totalCount}
          itemsPerPage={USER_RETURNS_PER_PAGE}
        />
      </div>
    </div>
  );
};
