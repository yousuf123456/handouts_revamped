import React from "react";

import { CheckCircle2, Package, Store, Truck } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { UserOrder } from "../../_serverFunctions/getUserOrders";
import { OrderedProductCard } from "@/app/dashboard/_components/OrderedProductCard";

import {
  Card,
  CardHeader,
  CardFooter,
  CardContent,
  CardTitle,
} from "@/components/ui/card";

import Link from "next/link";
import { routes } from "@/app/_config/routes";
import { getStatusPercentage } from "@/app/dashboard/_utils";

export const OrderPackageCard = ({
  orderPackage,
}: {
  orderPackage: UserOrder["packages"][number];
}) => {
  return (
    <Card key={orderPackage.storeId} className="w-full">
      <CardHeader className="flex flex-row items-center justify-between p-4">
        <CardTitle className="flex items-center text-sm font-semibold uppercase sm:text-base">
          <Store className="mr-2 h-5 w-5" />
          {orderPackage.orderedProducts[0].product.storeName}
        </CardTitle>

        <div className="flex items-center">
          {getStatusIcon(orderPackage.status)}
          <span className="ml-2 text-sm font-medium">
            {orderPackage.status}
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 p-4">
        <Progress
          value={getStatusPercentage(orderPackage.status)}
          className="w-full"
        />

        {orderPackage.orderedProducts.map((orderedProduct, i) => (
          <OrderedProductCard
            hideStatus={orderedProduct.status === orderPackage.status}
            orderedProduct={orderedProduct}
            key={i}
          />
        ))}
      </CardContent>

      <CardFooter className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium">
            Subtotal: ${orderPackage.totalAmmount.toFixed(2)}
          </p>
          <p className="text-sm text-muted-foreground">
            Delivery Fee: ${orderPackage.delieveryFee.toFixed(2)}
          </p>
        </div>

        <div className="flex items-center gap-4">
          {orderPackage.status !== "Cancelled" &&
            orderPackage.status !== "CancellationInProcess" &&
            orderPackage.status !== "Delievered" && (
              <Link
                href={`${routes.orderRequests(
                  orderPackage.orderId,
                )}?type=cancel&packageId=${orderPackage.id}`}
                className={buttonVariants({
                  variant: "destructive",
                  size: "sm",
                })}
              >
                Cancel Items
              </Link>
            )}

          {orderPackage.status === "Delievered" && (
            <Link
              href={`${routes.orderRequests(
                orderPackage.orderId,
              )}?type=return&packageId=${orderPackage.id}`}
              className={buttonVariants({
                size: "sm",
                variant: "secondary",
              })}
            >
              Return Items
            </Link>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export const getStatusIcon = (status: string) => {
  switch (status) {
    case "Processing":
      return <Package className="h-5 w-5" />;
    case "Shipped":
      return <Truck className="h-5 w-5" />;
    case "Delivered":
      return <CheckCircle2 className="h-5 w-5" />;
    default:
      return <Package className="h-5 w-5" />;
  }
};
