"use client";
import React, { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  MapPin,
  Phone,
  Home,
  Briefcase,
  Edit,
  Trash2,
  Loader2,
} from "lucide-react";

import Link from "next/link";
import { Address } from "@prisma/client";
import { routes } from "@/app/_config/routes";
import { Button, buttonVariants } from "@/components/ui/button";
import { deleteAddress } from "../dashboard/addressDiary/_serverActions/deleteAddress";
import { toast } from "sonner";

export const AddressCard = ({ address }: { address: Address }) => {
  const [isPerformingAction, setIsPerformingAction] = useState(false);

  const onDelete = async (addressId: string) => {
    setIsPerformingAction(true);

    const response = await deleteAddress(addressId);
    if (!response.success) toast.error(response.message);

    setIsPerformingAction(false);
  };

  return (
    <Card key={address.id} className="w-full">
      <CardContent className="p-4">
        <div className="mb-2 flex items-start justify-between">
          <span className="font-medium">{address.fullName}</span>
          <div className="flex space-x-1">
            {address.isDefaultBillingAddress && (
              <Badge variant="secondary" className="text-xs">
                Billing
              </Badge>
            )}
            {address.isDefaultShippingAddress && (
              <Badge variant="secondary" className="text-xs">
                Shipping
              </Badge>
            )}
          </div>
        </div>

        <div className="mt-2 space-y-1 text-sm">
          <p className="flex items-center">
            <MapPin className="mr-1 h-3 w-3" />
            {address.address}, {address.area}, {address.city},{" "}
            {address.province}
          </p>
          <p className="flex items-center">
            <Phone className="mr-1 h-3 w-3" />
            {address.phone}
          </p>
          <div className="flex items-center justify-between">
            <span className="flex items-center">
              {address.type === "Home" ? (
                <Home className="mr-1 h-3 w-3" />
              ) : (
                <Briefcase className="mr-1 h-3 w-3" />
              )}
              {address.type}
            </span>
            <span className="text-xs text-muted-foreground">
              {address.landmark}
            </span>
          </div>
        </div>

        <div className="mt-3 flex justify-end space-x-2">
          <Link
            href={`${routes.addAddress}?addressId=${address.id}`}
            className={buttonVariants({
              size: "sm",
              variant: "outline",
              className: "px-2 text-xs",
            })}
          >
            <Edit className="mr-1 h-3 w-3" />
            Edit
          </Link>

          <Button
            size="sm"
            variant="outline"
            disabled={isPerformingAction}
            onClick={() => onDelete(address.id)}
            className="px-2 text-xs text-destructive hover:border-destructive hover:bg-destructive hover:text-destructive-foreground"
          >
            {!isPerformingAction && <Trash2 className="mr-1 h-3 w-3" />}
            {isPerformingAction && (
              <Loader2 className="mr-1 h-3 w-3 animate-spin" />
            )}
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
