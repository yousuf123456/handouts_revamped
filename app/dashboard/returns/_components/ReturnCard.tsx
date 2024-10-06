import React from "react";

import { Card, CardContent } from "@/components/ui/card";

import Link from "next/link";
import { format } from "date-fns";
import { routes } from "@/app/_config/routes";
import { CalendarIcon, ChevronRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { OrderedProductCard } from "../../_components/OrderedProductCard";

import { UserReturn } from "../_serverFunctions/getUserReturns";

export const ReturnCard = ({ userReturn }: { userReturn: UserReturn }) => {
  return (
    <Card key={userReturn.id} className="w-full">
      <CardContent className="space-y-8 p-4">
        <div className="flex flex-wrap items-center justify-between gap-5">
          <div className="space-y-1 max-[580px]:w-full max-[580px]:text-center">
            <p className="flex items-center font-semibold max-[580px]:justify-center">
              Requested On: <CalendarIcon className="ml-2 mr-1 h-4 w-4" />
              {format(new Date(userReturn.createdAt), "MMM dd, yyyy")}
            </p>
            <p className="text-sm text-muted-foreground">
              Request #{userReturn.id}
            </p>
            <p className="text-sm text-muted-foreground">
              Order #{userReturn.orderId}
            </p>
          </div>

          <Link
            href={routes.returnDetails(userReturn.id)}
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
          {userReturn.orderedProducts.map((orderedProduct, i) => (
            <OrderedProductCard orderedProduct={orderedProduct} key={i} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
