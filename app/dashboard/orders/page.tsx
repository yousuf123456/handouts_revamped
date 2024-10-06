import React, { Suspense } from "react";
import { UserOrders } from "./_components/UserOrders";
import { HeadingWrapper } from "../_components/HeadingWrapper";

import { PaginationSearchParams } from "@/app/_types";
import OrdersLoading from "./_loading";

type SearchParams = PaginationSearchParams;

export default function Orders({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  return (
    <Suspense
      key={parseInt(searchParams.page || "1")}
      fallback={<OrdersLoading />}
    >
      <HeadingWrapper heading="Your Orders">
        <UserOrders
          page={parseInt(searchParams.page || "1")}
          filter={undefined}
          sort={undefined}
        />
      </HeadingWrapper>
    </Suspense>
  );
}
