import React from "react";

import Link from "next/link";
import { unstable_cache } from "next/cache";
import { userAuthentication } from "@/app/_serverFunctions/userAuthentication";

import { CircleOff } from "lucide-react";
import { getSignInUrl, routes } from "@/app/_config/routes";
import { Button } from "@/components/ui/button";
import { CancellationCard } from "./CancellationCard";
import { EmptyState } from "@/app/_components/EmptyState";
import { userCancellationsCache } from "@/app/_config/cache";
import { PaginationControl } from "@/app/_components/PaginationControl";
import { getUserCancellations } from "../_serverFunctions/getUserCancellations";

import { USER_CANCELLATIONS_PER_PAGE } from "@/app/_config/pagination";
import { PaginationParams } from "@/app/_types";
import { notFound, ReadonlyURLSearchParams, redirect } from "next/navigation";

type UserCancellationsProps = PaginationParams;

export const UserCancellations = async (props: UserCancellationsProps) => {
  const { dbUserId, isUserAuthenticated } = userAuthentication();

  if (!isUserAuthenticated)
    return redirect(
      getSignInUrl(
        routes.cancelledOrders,
        new URLSearchParams() as ReadonlyURLSearchParams,
      ),
    );

  if (!dbUserId) return notFound();

  const { userCancellations, totalCount } = await unstable_cache(
    getUserCancellations,
    userCancellationsCache.keys,
    {
      tags: userCancellationsCache.tags(dbUserId),
      revalidate: userCancellationsCache.duration,
    },
  )({ ...props, dbUserId });

  if (userCancellations.length === 0)
    return (
      <EmptyState
        Icon={CircleOff}
        heading="No Cancellations Yet"
        actionLabel="If you have any concerns, you can easily cancel your order hassle-free before it ships!"
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
      {userCancellations.map((userCancellation, i) => (
        <CancellationCard userCancellation={userCancellation} key={i} />
      ))}

      <div className="mx-auto mt-6">
        <PaginationControl
          totalCount={totalCount}
          itemsPerPage={USER_CANCELLATIONS_PER_PAGE}
        />
      </div>
    </div>
  );
};
