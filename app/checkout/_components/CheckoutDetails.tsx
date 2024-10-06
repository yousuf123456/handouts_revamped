"use client";
import React, { useState } from "react";

import { Address } from "@prisma/client";

import { CheckoutTotal } from "./CheckoutTotal";
import { SelectAddress } from "./SelectAddress";
import { GroupedCheckoutProducts } from "./CheckoutSummary";
import Link from "next/link";
import { routes } from "@/app/_config/routes";
import { buttonVariants } from "@/components/ui/button";
import { usePathname, useSearchParams } from "next/navigation";

export const CheckoutDetails = ({
  groupedCheckoutProducts,
  addressDiary,
}: {
  addressDiary: Address[];
  groupedCheckoutProducts: GroupedCheckoutProducts;
}) => {
  const [billingAddress, setBillingAddress] = useState<Address | undefined>(
    addressDiary.filter((addr) => addr.isDefaultBillingAddress)[0],
  );

  const [shippingAddress, setShippingAddress] = useState<Address | undefined>(
    addressDiary.filter((addr) => addr.isDefaultShippingAddress)[0],
  );

  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (
    <div className="flex flex-col gap-6 lg:w-1/3">
      <div className="flex flex-col gap-6">
        {addressDiary.length === 0 && (
          <Link
            href={`${routes.addAddress}?redirectUrl=${encodeURIComponent(
              `${pathname}?${searchParams}`,
            )}`}
            className={buttonVariants({
              variant: "outline",
            })}
          >
            Add New Address
          </Link>
        )}

        {billingAddress && (
          <SelectAddress
            addressDiary={addressDiary}
            selectedAddress={billingAddress}
            buttonLabel="Change Billing Address"
            setSelectedAddress={setBillingAddress}
          />
        )}

        {shippingAddress && (
          <SelectAddress
            addressDiary={addressDiary}
            selectedAddress={shippingAddress}
            buttonLabel="Change Shipping Address"
            setSelectedAddress={setShippingAddress}
          />
        )}
      </div>

      <CheckoutTotal
        billingAddress={billingAddress}
        shippingAddress={shippingAddress}
        groupedCheckoutProducts={groupedCheckoutProducts}
      />
    </div>
  );
};
