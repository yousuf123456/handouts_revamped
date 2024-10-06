import React from "react";

import prisma from "@/app/_libs/prismadb";
import { redirect } from "next/navigation";
import { routes } from "@/app/_config/routes";
import { OrderRequestForm } from "./_components/OrderRequestForm";
import { HeadingWrapper } from "@/app/dashboard/_components/HeadingWrapper";

interface SearchParams {
  packageId: string;
  type: "cancel" | "return";
}

export default async function OrderRequestsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  if (searchParams.type !== "cancel" && searchParams.type !== "return")
    return redirect(`${routes.orders}`);

  const orderPackage = await prisma.package.findUnique({
    where: { id: searchParams.packageId },
    include: { orderedProducts: true },
  });

  if (!orderPackage) return "Invalid Package Id";

  // if (searchParams.type === "return" && orderPackage.status !== "Delievered")
  //   return redirect(`${routes.orders}`);

  return (
    <HeadingWrapper
      heading={`${
        searchParams.type === "cancel" ? "Cancel" : "Return"
      } Products`}
    >
      <OrderRequestForm orderPackage={orderPackage} />
    </HeadingWrapper>
  );
}
