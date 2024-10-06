"use client";
import React, { useState } from "react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardFooter,
  CardContent,
} from "@/components/ui/card";

import { Voucher } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, SignInButton, useUser } from "@clerk/nextjs";
import { Check, Clock, DollarSign, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { collectVoucher } from "../_serverActions/collectVoucher";

export const VoucherCard = ({
  voucher,
}: {
  voucher: Voucher & { bucketId: string };
}) => {
  const { user } = useUser();
  const dbUserId = user?.publicMetadata?.dbUserId as string | undefined;

  const [isPerformingAction, setIsPerformingAction] = useState(false);

  const [hasBeenCollected, setHasBeenCollected] = useState(
    voucher.collectedBy.includes(dbUserId || ""),
  );

  const onCollect = () => {
    setIsPerformingAction(true);

    toast.promise(collectVoucher({ voucher }), {
      loading: "Collecting Voucher",
      success(data) {
        if (data.success) {
          setHasBeenCollected(true);
          return data.message;
        } else throw new Error(data.message);
      },
      error(data) {
        return data.message;
      },
      finally() {
        setIsPerformingAction(false);
      },
    });
  };

  return (
    <Card key={voucher.id} className="mb-4">
      <CardHeader>
        <CardTitle>{voucher.voucherName}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="flex items-center text-sm">
            <DollarSign className="mr-1 h-4 w-4" />
            {voucher.discountOffValue}.
            {voucher.discountType === "PercentageValue" ? "%" : "Rs"} off
          </p>

          <p className="flex items-center text-sm">
            <ShoppingBag className="mr-1 h-4 w-4" />
            Min. order: Rs.{voucher.minOrderValue}
          </p>
          <p className="flex items-center text-sm">
            <Clock className="mr-1 h-4 w-4" />
            Expires: {voucher.endingDate.toLocaleDateString()}
          </p>
          <p className="text-sm">
            Used: {voucher.vouchersUsed} / {voucher.totalVouchers}
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <SignedIn>
          <Button
            className="w-full"
            onClick={onCollect}
            disabled={hasBeenCollected || isPerformingAction}
          >
            {hasBeenCollected ? (
              <>
                <Check className="mr-2 h-4 w-4" /> Collected
              </>
            ) : (
              "Collect"
            )}
          </Button>
        </SignedIn>
        <SignedOut>
          <SignInButton>
            <Button className="w-full">Collect</Button>
          </SignInButton>
        </SignedOut>
      </CardFooter>
    </Card>
  );
};
