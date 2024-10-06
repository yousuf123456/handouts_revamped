import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export const OrderTotal = ({
  totalAmmount,
  delieveryFee,
}: {
  totalAmmount: number;
  delieveryFee: number;
}) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex justify-between">
          <span>Products Total:</span>
          <span>Rs. {totalAmmount}</span>
        </div>
        <div className="flex justify-between">
          <span>Total Delivery Fee:</span>
          <span>Rs. {delieveryFee}</span>
        </div>
        <Separator />
        <div className="flex justify-between font-bold">
          <span>Overall Total:</span>
          <span>Rs. {totalAmmount + delieveryFee}</span>
        </div>
      </CardContent>
    </Card>
  );
};
