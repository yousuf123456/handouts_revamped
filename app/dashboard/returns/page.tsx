import React, { Suspense } from "react";

import { PaginationSearchParams } from "@/app/_types";
import { UserReturns } from "./_components/UserReturns";
import { HeadingWrapper } from "../_components/HeadingWrapper";
import ReturnsLoading from "./_loading";

type SearchParams = PaginationSearchParams;

export default function UserReturnsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  return (
    <Suspense
      key={parseInt(searchParams.page || "1")}
      fallback={<ReturnsLoading />}
    >
      <HeadingWrapper heading="Your Returns">
        <UserReturns
          page={parseInt(searchParams.page || "1")}
          filter={undefined}
          sort={undefined}
        />
      </HeadingWrapper>
    </Suspense>
  );
}
