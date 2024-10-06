import React, { useContext } from "react";

import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { requestFormContext, RequestFormData } from "./OrderRequestForm";
import { OrderedProduct } from "@prisma/client";
import { OrderedProductCard } from "@/app/dashboard/_components/OrderedProductCard";

const reasons = [
  "Product arrived damaged",
  "Received wrong item",
  "Quality not as expected",
  "Found a better price",
  "Ordered by mistake",
  "Item didn't match description",
  "other",
];

interface SelectRequestProductsProps {
  orderedProducts: OrderedProduct[];
}

export const SelectRequestProducts = ({
  orderedProducts,
}: SelectRequestProductsProps) => {
  const { requestFormData, setRequestFormData } =
    useContext(requestFormContext);

  const handleProductSelect = (
    orderedProductId: string,
    reason: string = reasons[0],
  ) => {
    setRequestFormData((prev) => {
      const existingIndex = prev.selectedOrderedProducts.findIndex(
        (item) => item.id === orderedProductId,
      );

      if (existingIndex > -1) {
        return {
          ...prev,
          selectedOrderedProducts: prev.selectedOrderedProducts.filter(
            (item) => item.id !== orderedProductId,
          ),
        };
      } else {
        return {
          ...prev,
          selectedOrderedProducts: [
            ...prev.selectedOrderedProducts,
            { id: orderedProductId, reason },
          ],
        };
      }
    });
  };

  const handleReasonChange = (orderedProductId: string, reason: string) => {
    setRequestFormData((prev) => ({
      ...prev,
      selectedOrderedProducts: prev.selectedOrderedProducts.map((item) =>
        item.id === orderedProductId ? { ...item, reason } : item,
      ),
    }));
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <h2 className="mb-3 text-base font-medium">
          Select Products to Cancel
        </h2>

        <div className="space-y-4">
          {orderedProducts.map((orderedProduct) => {
            const isSelected = requestFormData.selectedOrderedProducts.some(
              (item) => item.id === orderedProduct.id,
            );

            const selectedReason =
              requestFormData.selectedOrderedProducts.find(
                (item) => item.id === orderedProduct.id,
              )?.reason || "";

            return (
              <div
                key={orderedProduct.id}
                className="flex flex-col gap-2 md:flex-row md:items-center"
              >
                <div className="flex flex-grow items-center space-x-4">
                  <Checkbox
                    id={`product-${orderedProduct.id}`}
                    checked={isSelected}
                    onCheckedChange={() =>
                      handleProductSelect(orderedProduct.id)
                    }
                  />

                  <OrderedProductCard
                    orderedProduct={orderedProduct}
                    hideStatus
                  />
                </div>

                {isSelected && (
                  <Select
                    value={selectedReason}
                    onValueChange={(value) =>
                      handleReasonChange(orderedProduct.id, value)
                    }
                    required
                  >
                    <SelectTrigger className="w-full md:w-auto">
                      <SelectValue placeholder="Select a reason" />
                    </SelectTrigger>
                    <SelectContent>
                      {reasons.map((reason) => (
                        <SelectItem key={reason} value={reason}>
                          {reason}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
