import React from "react";
import prisma from "@/app/_libs/prismadb";

import { OrderTotal } from "./OrderTotal";
import { CalendarIcon } from "lucide-react";
import { OrderPackageCard } from "./OrderPackageCard";
import { Card, CardContent } from "@/components/ui/card";
import { UserOrder } from "../../_serverFunctions/getUserOrders";
import { OrderAddresses } from "./OrderAddresses";
import { Address } from "@prisma/client";

export const OrderDetails = async ({ orderId }: { orderId: string }) => {
  const userOrder = (await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      packages: {
        include: {
          orderedProducts: true,
        },
      },
    },
  })) as UserOrder | null;

  if (!userOrder) return <p>Invalid Order Id</p>;

  return (
    <div className="flex flex-col gap-6">
      <Card className="w-full">
        <CardContent className="p-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm text-muted-foreground">Order ID</p>
              <p className="font-medium">{userOrder.id}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Placed On</p>
              <p className="flex items-center font-medium">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {new Date(userOrder.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {userOrder.packages.map((_package, i) => (
        <OrderPackageCard orderPackage={_package} key={i} />
      ))}

      <OrderAddresses
        billingAddress={userOrder.billingAddress as Address}
        shippingAddress={userOrder.shippingAddress as Address}
      />

      <OrderTotal
        totalAmmount={userOrder.totalAmmount}
        delieveryFee={userOrder.delieveryFee}
      />
    </div>
  );
};
