import React from "react";

import prisma from "@/app/_libs/prismadb";

import { CalendarIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { CancelledProducts } from "./CancelledProducts";
import { UserCancellation } from "../../_serverFunctions/getUserCancellations";

export const CancellationDetails = async ({
  cancellationId,
}: {
  cancellationId: string;
}) => {
  const userCancellation = (await prisma.cancellationRequest.findUnique({
    where: { id: cancellationId },
    include: {
      orderedProducts: true,
    },
  })) as UserCancellation | null;

  if (!userCancellation) return <p>Invalid Cancellation Id</p>;

  return (
    <div className="flex flex-col gap-6">
      <Card className="w-full">
        <CardContent className="p-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm text-muted-foreground">Cancellation ID</p>
              <p className="font-medium">{userCancellation.id}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Order ID</p>
              <p className="font-medium">{userCancellation.orderId}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Request Date</p>
              <p className="flex items-center font-medium">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {new Date(userCancellation.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <CancelledProducts
        cancelledProducts={userCancellation.orderedProducts}
        requestStatus={userCancellation.status}
      />
    </div>
  );
};
