import React from "react";

import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { getStatusPercentage } from "@/app/dashboard/_utils";
import { OrderedProductCard } from "@/app/dashboard/_components/OrderedProductCard";
import { getStatusIcon } from "@/app/dashboard/orders/[orderId]/_components/OrderPackageCard";

import { OrderedProduct, ReturnRequestStatus } from "@prisma/client";

export const ReturnedProducts = ({
  returnedProducts,
  requestStatus,
}: {
  returnedProducts: OrderedProduct[];
  requestStatus: ReturnRequestStatus;
}) => {
  return (
    <Card className="mb-6 w-full">
      <CardHeader className="flex flex-row items-center justify-between p-4">
        <CardTitle className="flex items-center text-sm font-semibold uppercase sm:text-base">
          Returned Products
        </CardTitle>

        <div className="flex items-center">
          {getStatusIcon(requestStatus)}

          <span className="ml-2 text-sm font-medium">
            {returnedProducts[0].status}
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 p-4">
        <Progress
          value={getStatusPercentage(requestStatus)}
          className="w-full"
        />

        {returnedProducts.map((orderedProduct, i) => (
          <div key={i} className="flex flex-col">
            <OrderedProductCard orderedProduct={orderedProduct} hideStatus />

            <p className="mt-2 text-sm text-muted-foreground">
              Reason: {orderedProduct.returnReason}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
