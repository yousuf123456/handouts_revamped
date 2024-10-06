"use client";
import React from "react";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { routes } from "@/app/_config/routes";

export const ProductTabs = ({
  productCollectionNames,
}: {
  productCollectionNames: string[];
}) => {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  const storeId = params.sellerId as string;
  const productsCollection = searchParams.get("productsCollectionName");

  const tabs = ["All Products", ...productCollectionNames];

  return (
    <Tabs
      className="w-full"
      defaultValue="All Products"
      value={productsCollection || "All Products"}
      onValueChange={(tab) => {
        if (tab !== "All Products")
          router.push(
            routes.storeDetails(`${storeId}?productsCollectionName=${tab}`),
          );
        else router.push(routes.storeDetails(`${storeId}`));
      }}
    >
      <TabsList className="mb-8 flex w-full flex-wrap justify-center bg-gray-100 p-1 shadow-sm">
        {tabs.map((tab) => (
          <TabsTrigger key={tab} value={tab} className="capitalize">
            {tab}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};
