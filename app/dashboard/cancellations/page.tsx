import React, { Suspense } from "react";
import { HeadingWrapper } from "../_components/HeadingWrapper";
import { PaginationSearchParams } from "@/app/_types";
import { UserCancellations } from "./_components/UserCancellations";
import CancellationsLoading from "./_loading";

type SearchParams = PaginationSearchParams;

export default function UserCancellationsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  return (
    <Suspense
      key={parseInt(searchParams.page || "1")}
      fallback={<CancellationsLoading />}
    >
      <HeadingWrapper heading="Your Cancellations">
        <UserCancellations
          page={parseInt(searchParams.page || "1")}
          filter={undefined}
          sort={undefined}
        />
      </HeadingWrapper>
    </Suspense>
  );
}
