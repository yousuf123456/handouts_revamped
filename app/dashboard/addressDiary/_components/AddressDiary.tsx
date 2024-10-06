import React from "react";
import getDBUser from "@/app/_serverActions/getDBUser";

import Link from "next/link";
import { MapPin } from "lucide-react";
import { routes } from "@/app/_config/routes";
import { redirect } from "next/navigation";
import { AddressCard } from "../../../_components/AddressCard";
import { EmptyState } from "@/app/_components/EmptyState";
import { Button, buttonVariants } from "@/components/ui/button";

export const AddressDiary = async () => {
  const { user } = await getDBUser();

  if (!user) redirect(routes.home);

  return (
    <div className="flex flex-col gap-8">
      {user.addressDiary.length > 0 && (
        <div className="mx-auto">
          <Link
            href={routes.addAddress}
            className={buttonVariants({ variant: "outline" })}
          >
            Add New Address
          </Link>
        </div>
      )}

      {user.addressDiary.length === 0 && (
        <EmptyState
          Icon={MapPin}
          heading="Empty Address Diary"
          actionLabel="Add a new address to enjoy faster and more convenient deliveries!"
        >
          <Link href={routes.addAddress}>
            <Button
              size={"lg"}
              variant={"corners"}
              className="w-full uppercase"
            >
              Add New Address
            </Button>
          </Link>
        </EmptyState>
      )}

      {user.addressDiary.length > 0 && (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {user.addressDiary.map((address, i) => (
            <AddressCard key={i} address={address} />
          ))}
        </div>
      )}
    </div>
  );
};
