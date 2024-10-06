import React from "react";

import prisma from "@/app/_libs/prismadb";

import { CalendarIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

import { UserReturn } from "../../_serverFunctions/getUserReturns";
import { ReturnedProducts } from "./ReturnedProducts";
import { ReturnRequestImages } from "./ReturnRequestImages";

export const ReturnDetails = async ({ returnId }: { returnId: string }) => {
  const userReturn = (await prisma.returnRequest.findUnique({
    where: { id: returnId },
    include: {
      orderedProducts: true,
    },
  })) as UserReturn | null;

  if (!userReturn) return <p>Invalid Return Id</p>;

  return (
    <div className="flex flex-col gap-6">
      <Card className="w-full">
        <CardContent className="p-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm text-muted-foreground">Return ID</p>
              <p className="font-medium">{userReturn.id}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Order ID</p>
              <p className="font-medium">{userReturn.orderId}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Request Date</p>
              <p className="flex items-center font-medium">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {new Date(userReturn.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <ReturnedProducts
        returnedProducts={userReturn.orderedProducts}
        requestStatus={userReturn.status}
      />

      {userReturn.proofImages.length > 0 && (
        <ReturnRequestImages proofImages={userReturn.proofImages} />
      )}
    </div>
  );
};
