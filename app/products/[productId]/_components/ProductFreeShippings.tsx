import React from "react";

import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import {
  Card,
  CardHeader,
  CardTitle,
  CardFooter,
  CardContent,
} from "@/components/ui/card";

import { Check, Clock, DollarSign, ShoppingBag, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FreeShipping } from "@prisma/client";

interface ProductFreeShippingsProps {
  freeShippings: FreeShipping[];
}

export const ProductFreeShippings = ({
  freeShippings,
}: ProductFreeShippingsProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex w-full items-center gap-2">
          <Tag className="h-4 w-4" />
          {freeShippings.length} Free Shippings
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[640px]">
        <DialogHeader>
          <DialogTitle>Free Shipping Vouchers</DialogTitle>
          <DialogDescription>
            They will automatically be applied during checkout.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[400px] w-full pr-4">
          {freeShippings.map((freeShipping) => (
            <Card key={freeShipping.id} className="mb-4">
              <CardHeader>
                <CardTitle>{freeShipping.promotionName}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="flex items-center text-sm">
                    <ShoppingBag className="mr-1 h-4 w-4" />
                    Free Shipping
                  </p>

                  <p className="flex items-center text-sm">
                    <ShoppingBag className="mr-1 h-4 w-4" />
                    Min. order: Rs.{freeShipping.minOrderValue}
                  </p>

                  <p className="flex items-center text-sm">
                    <Clock className="mr-1 h-4 w-4" />
                    Expires: {freeShipping.endingDate.toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
