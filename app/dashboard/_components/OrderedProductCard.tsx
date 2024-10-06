import React from "react";
import { OrderedProduct } from "@prisma/client";
import { ProductImage } from "@/app/_components/ProductImage";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { routes } from "@/app/_config/routes";

export const OrderedProductCard = ({
  orderedProduct,
  hideStatus,
}: {
  orderedProduct: OrderedProduct;
  hideStatus?: boolean;
}) => {
  return (
    <div
      key={orderedProduct.id}
      className="flex flex-col gap-4 sm:flex-row sm:items-center"
    >
      <Link
        className="flex-1"
        href={routes.productDetails(orderedProduct.product.id)}
      >
        <div className="flex flex-1 items-center space-x-4">
          <div className="relative h-[68px] w-[68px] overflow-hidden rounded sm:h-20 sm:w-20">
            <ProductImage
              fill
              alt={orderedProduct.product.name}
              src={orderedProduct.product.image}
            />
          </div>

          <div className="min-w-0 flex-1">
            <p className="line-clamp-2 text-sm font-medium uppercase">
              {orderedProduct.product.name}
            </p>
            <div className="flex gap-2">
              <p className="text-sm text-muted-foreground">
                Qty: {orderedProduct.quantity}
              </p>
              <p className="text-sm text-muted-foreground">
                {Object.values(
                  orderedProduct.selectedCombination?.combination || {},
                ).join(", ")}
              </p>
            </div>
            <p className="text-sm font-medium">
              Rs. {orderedProduct.priceAtOrderTime}
            </p>
          </div>
        </div>
      </Link>

      {!hideStatus && (
        <Badge
          className="w-fit"
          variant={
            orderedProduct.status === "Delievered" ? "secondary" : "outline"
          }
        >
          {orderedProduct.status}
        </Badge>
      )}
    </div>
  );
};
