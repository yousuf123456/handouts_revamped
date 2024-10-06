import React from "react";

import { CancellationRequestStatus, OrderedProduct } from "@prisma/client";
import {
  Card,
  CardHeader,
  CardTitle,
  CardFooter,
  CardContent,
} from "@/components/ui/card";
import { getStatusIcon } from "@/app/dashboard/orders/[orderId]/_components/OrderPackageCard";
import { Progress } from "@/components/ui/progress";
import { getStatusPercentage } from "@/app/dashboard/_utils";
import { OrderedProductCard } from "@/app/dashboard/_components/OrderedProductCard";

export const CancelledProducts = ({
  cancelledProducts,
  requestStatus,
}: {
  cancelledProducts: OrderedProduct[];
  requestStatus: CancellationRequestStatus;
}) => {
  return (
    <div className="flex flex-col gap-6">
      <Card className="mb-6 w-full">
        <CardHeader className="flex flex-row items-center justify-between p-4">
          <CardTitle className="flex items-center text-sm font-semibold uppercase sm:text-base">
            Cancelled Products
          </CardTitle>

          <div className="flex items-center">
            {getStatusIcon(requestStatus)}

            <span className="ml-2 text-sm font-medium">
              {cancelledProducts[0].status}
            </span>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 p-4">
          <Progress
            value={getStatusPercentage(requestStatus)}
            className="w-full"
          />

          {cancelledProducts.map((orderedProduct, i) => (
            <div key={i} className="flex flex-col">
              <OrderedProductCard orderedProduct={orderedProduct} hideStatus />

              <p className="mt-2 text-sm text-muted-foreground">
                Reason: {orderedProduct.cancellationReason}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
