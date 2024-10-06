import React from "react";
import { Address } from "@prisma/client";
import { AddressCard } from "@/app/_components/AddressCard";

export const OrderAddresses = ({
  billingAddress,
  shippingAddress,
}: {
  billingAddress: Address;
  shippingAddress: Address;
}) => {
  return (
    <div className="my-5 grid grid-cols-1 gap-5 md:grid-cols-2">
      <div className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold sm:text-xl">Billing Address</h2>
        <AddressCard address={billingAddress} />
      </div>
      <div className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold sm:text-xl">Shipping Address</h2>
        <AddressCard address={shippingAddress} />
      </div>
    </div>
  );
};
