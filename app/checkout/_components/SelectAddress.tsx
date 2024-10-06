import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { AddressCard } from "@/app/_components/AddressCard";

import { Address } from "@prisma/client";

interface SelectAddressProps {
  buttonLabel: string;
  addressDiary: Address[];
  selectedAddress: Address;
  setSelectedAddress: React.Dispatch<React.SetStateAction<Address | undefined>>;
}

export const SelectAddress = ({
  buttonLabel,
  addressDiary,
  selectedAddress,
  setSelectedAddress,
}: SelectAddressProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleAddressSelect = (address: Address) => {
    setSelectedAddress(address);
    setIsOpen(false);
  };

  return (
    <div className="w-full">
      <AddressCard address={selectedAddress} />

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button className="mt-3" variant={"outline"}>
            {buttonLabel}
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-5xl">
          <DialogHeader>
            <DialogTitle>Select an Address</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4 sm:grid-cols-2">
            {addressDiary.map((address) => (
              <div
                key={address.id}
                className="cursor-pointer"
                onClick={() => handleAddressSelect(address)}
              >
                <AddressCard address={address} />
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
