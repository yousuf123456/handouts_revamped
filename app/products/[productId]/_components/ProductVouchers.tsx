import React from "react";

import { Voucher } from "@prisma/client";

import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import { Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { VoucherCard } from "./VoucherCard";

interface ProductVouchersProps {
  vouchers: (Voucher & { bucketId: string })[];
}

export const ProductVouchers = ({ vouchers }: ProductVouchersProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex w-full items-center gap-2">
          <Tag className="h-4 w-4" />
          {vouchers.length} Vouchers Available
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[640px]">
        <DialogHeader>
          <DialogTitle>Available Vouchers</DialogTitle>
          <DialogDescription>
            Click on a voucher to collect it. You can use these vouchers during
            checkout.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[400px] w-full pr-4">
          {vouchers.map((voucher) => (
            <VoucherCard key={voucher.id} voucher={voucher} />
          ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
