import React from "react";

import { getPriceInfo } from "@/app/_utils/getPriceInfo";
import { Card, CardContent } from "@/components/ui/card";
import { GroupedCheckoutProducts } from "./CheckoutSummary";
import { ProductImage } from "@/app/_components/ProductImage";

interface CheckoutProductsGroupProps {
  groupedCheckoutProduct: GroupedCheckoutProducts[string];
}

export const CheckoutProductsGroup = ({
  groupedCheckoutProduct,
}: CheckoutProductsGroupProps) => {
  return (
    <Card className="w-full">
      <CardContent className="w-full p-5">
        <div>
          <h2 className="mb-6 text-base font-medium uppercase underline">
            {groupedCheckoutProduct.storeName}
          </h2>

          <div className="space-y-6">
            {groupedCheckoutProduct.checkoutProducts.map(
              (checkoutProduct, i) => {
                const { currentPrice } = getPriceInfo(
                  checkoutProduct.product,
                  checkoutProduct.selectedCombinationId,
                );

                const appliedVoucher = checkoutProduct.product.appliedVoucher;

                return (
                  <div
                    key={i}
                    className="flex flex-col gap-4 max-sm:justify-center sm:flex-row sm:items-center"
                  >
                    <div className="flex flex-grow items-center gap-4">
                      <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md">
                        <ProductImage
                          fill
                          src={checkoutProduct.product.image}
                          alt={checkoutProduct.product.name}
                          className="flex-shrink-0 rounded-md bg-red-300 object-cover"
                        />
                      </div>

                      <div className="flex-grow">
                        <h3 className="text-sm uppercase">
                          {checkoutProduct.product.name}
                        </h3>

                        <p className="text-sm text-gray-500">
                          Quantity: {checkoutProduct.quantity}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:text-right">
                      <div className="mt-1 flex flex-shrink-0 items-center gap-2 max-sm:w-fit sm:flex-row-reverse">
                        <h2 className="font-prim text-lg">
                          Rs. {currentPrice * checkoutProduct.quantity}
                        </h2>

                        <p className="font-prim text-sm text-black/80 line-through">
                          Rs. {checkoutProduct.product.price}
                        </p>
                      </div>

                      {appliedVoucher && (
                        <p className="text-sm font-light text-sky-600 sm:max-w-[200px]">
                          Voucher applied: {appliedVoucher.voucherName} (
                          {appliedVoucher.discountOffValue}
                          {appliedVoucher.discountType === "MoneyValue"
                            ? "Rs"
                            : "%"}
                          )
                        </p>
                      )}
                    </div>
                  </div>
                );
              },
            )}
          </div>
        </div>
        <div className="mt-3 border-t border-gray-200 pt-3">
          <p className="text-right text-xs text-black sm:text-sm">
            Delivery Fee:{" "}
            {groupedCheckoutProduct.isFreeDelievery
              ? "Free"
              : `Rs. ${groupedCheckoutProduct.delieveryFee}`}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
