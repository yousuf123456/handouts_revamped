"use client";
import React, { useState } from "react";

import { toast } from "sonner";
import { Address } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { placeOrder } from "../_serverActions/placeOrder";
import { GroupedCheckoutProducts } from "./CheckoutSummary";
import { getGroupedCheckoutProductsTotal } from "../_utils/getGroupedCheckoutProductsTotal";
import { routes } from "@/app/_config/routes";

interface CheckoutTotalProps {
  billingAddress: Address | undefined;
  shippingAddress: Address | undefined;
  groupedCheckoutProducts: GroupedCheckoutProducts;
}

export const CheckoutTotal = ({
  groupedCheckoutProducts,
  shippingAddress,
  billingAddress,
}: CheckoutTotalProps) => {
  const [isPerformingAction, setIsPerformingAction] = useState(false);

  const { productsTotal, delieveryTotal } = getGroupedCheckoutProductsTotal(
    Object.values(groupedCheckoutProducts),
  );

  const router = useRouter();
  const searchParams = useSearchParams();

  const onPlaceOrder = () => {
    if (!billingAddress || !shippingAddress)
      return toast.error("Please add a shipping/billing address.");

    setIsPerformingAction(true);

    const promise = placeOrder({
      delieveryInfo: { shippingAddress, billingAddress },
      groupedCheckoutProducts,
      fromCart: searchParams.get("fromCart") === "true",
    });

    toast.promise(promise, {
      loading: "Placing your order",
      success(data) {
        if (data.success) {
          router.push(routes.orders);
          return data.message;
        } else throw new Error(data.message);
      },
      error(data) {
        return data.message;
      },
      finally() {
        setIsPerformingAction(false);

        // Take user to the payments page from here
      },
    });
  };

  return (
    <div className="mx-auto w-full max-w-lg rounded-lg bg-gray-50 p-6 shadow-sm">
      <h2 className="mb-4 text-xl font-semibold">Order Summary</h2>
      <div className="mb-2 flex justify-between text-sm">
        <span className="text-gray-600">Subtotal</span>
        <span>Rs. {productsTotal}</span>
      </div>
      <div className="mb-2 flex justify-between text-sm">
        <span className="text-gray-600">Total Delievery</span>
        <span>Rs. {delieveryTotal}</span>
      </div>
      <div className="mt-4 flex justify-between border-t pt-4 text-lg font-semibold">
        <span>Total</span>
        <span>Rs. {productsTotal + delieveryTotal}</span>
      </div>
      <Button
        onClick={onPlaceOrder}
        className="mt-6 w-full"
        disabled={isPerformingAction}
      >
        Place Order
      </Button>
    </div>
  );
};
