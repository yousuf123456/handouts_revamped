import React from "react";

import Link from "next/link";
import { format } from "date-fns";
import { ChevronRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { UserOrder } from "../_serverFunctions/getUserOrders";
import { OrderedProductCard } from "../../_components/OrderedProductCard";
import { routes } from "@/app/_config/routes";

export const OrderCard = ({ userOrder }: { userOrder: UserOrder }) => {
  return (
    <Card key={userOrder.id} className="w-full">
      <CardContent className="space-y-8 p-4">
        <div className="flex flex-wrap items-center justify-between gap-5">
          <div className="max-[580px]:w-full max-[580px]:text-center">
            <p className="font-semibold">Order #{userOrder.id}</p>
            <p className="text-sm text-muted-foreground">
              Placed on {format(new Date(userOrder.createdAt), "MMM dd, yyyy")}
            </p>
          </div>

          <Link
            href={routes.orderDetails(userOrder.id)}
            className={buttonVariants({
              size: "sm",
              variant: "outline",
              className: "flex w-full items-center min-[580px]:w-auto",
            })}
          >
            View Details
            <ChevronRight className="ml-2 h-4 w-4" />
          </Link>
        </div>

        <div className="space-y-4">
          {userOrder.packages.map((_package) =>
            _package.orderedProducts.map((orderedProduct, i) => (
              <OrderedProductCard orderedProduct={orderedProduct} key={i} />
            )),
          )}
        </div>
      </CardContent>
    </Card>
  );
};
