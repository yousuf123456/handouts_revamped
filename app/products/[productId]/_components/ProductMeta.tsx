"use client";
import React, { useState } from "react";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { HiStar } from "react-icons/hi";
import { Minus, Plus } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { ProductActions } from "./ProductActions";
import { getPriceInfo } from "@/app/_utils/getPriceInfo";
import { routes } from "@/app/_config/routes";
import { FreeShipping, ProductCombination, Voucher } from "@prisma/client";
import { ProductDetails } from "../_serverFunctions/getProductDetails";
import { ProductVouchers } from "./ProductVouchers";
import { ProductFreeShippings } from "./ProductFreeShippings";

const Heading = ({ text }: { text: string }) => {
  return (
    <p className="font-prim text-lg font-semibold uppercase text-black/80">
      {text}
    </p>
  );
};

interface ProductMetaProps {
  availableVouchers: (Voucher & { bucketId: string })[];
  availableFreeShippings: FreeShipping[];
  product: NonNullable<ProductDetails>;
}

export const ProductMeta = ({
  product,
  availableVouchers,
  availableFreeShippings,
}: ProductMetaProps) => {
  const [quantity, setQuantity] = useState(1);

  const { productOnSale, discountOffLabel, currentPrice } =
    getPriceInfo(product);

  const productCombinations = product?.combinations as unknown as
    | (ProductCombination & { combination: any })[]
    | undefined;

  const defaultProductCombination = productCombinations?.filter(
    (combination) => combination.default,
  )[0];

  const [selectedCombination, setSelectedCombination] = useState(
    defaultProductCombination,
  );

  const changeCombination = async (variant: string, value: string) => {
    if (!selectedCombination && !defaultProductCombination) return;

    const find = (await import("lodash/find")).default;

    if (find(selectedCombination, { [variant]: value })) {
      setSelectedCombination(undefined);
      return;
    }

    setSelectedCombination(() => {
      const prev = selectedCombination || defaultProductCombination;
      const combination = { ...prev!.combination, [variant]: value };
      const Combination = find(productCombinations, { combination });
      return Combination;
    });
  };

  let checkoutUrlSearchParams = [
    `productId=${product.id}`,
    `quantity=${quantity}`,
  ];
  if (selectedCombination?.id)
    checkoutUrlSearchParams.push(
      `selectedCombinationId=${selectedCombination.id}`,
    );

  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-4 sm:gap-6">
        <Link href={routes.storeDetails(product.storeId)}>
          <p className="font-prim max-w-md text-sm uppercase text-black underline sm:text-base">
            {product.storeName}
          </p>
        </Link>

        <p className="font-prim max-w-md text-xl font-medium uppercase text-black sm:text-2xl">
          {product.name}
        </p>

        <div className="flex w-full items-end justify-between">
          {productOnSale ? (
            <div className="flex items-end gap-1 sm:gap-4">
              <p className="font-prim text-3xl text-black">
                Rs. {currentPrice}
              </p>

              <p className="font-prim font-light text-black line-through sm:text-base">
                Rs. {product.price}
              </p>

              <p className="font-prim text-base font-light text-black">
                {discountOffLabel}
              </p>
            </div>
          ) : (
            <p className="font-prim text-3xl font-semibold text-black">
              Rs. {product.price}
            </p>
          )}

          <div className="flex h-fit items-center gap-1 rounded-3xl border border-zinc-300 px-2 py-0.5 md:mr-3 md:gap-3">
            <HiStar className="h-[18px] w-[18px] text-black/80" />
            <p className="font-prim text-base text-black/80">
              {product.avgRating}
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-4 sm:flex-row">
          <ProductVouchers vouchers={availableVouchers} />
          <ProductFreeShippings freeShippings={availableFreeShippings} />
        </div>

        <div className="my-2 h-[1px] w-full bg-zinc-300" />

        {product.variants &&
          Object.keys(product.variants).map((variant, i) => (
            <div key={i} className="flex flex-col items-start gap-1">
              <p className="font-prim text-sm font-medium text-zinc-600 sm:text-base">
                {product.variants[variant].title}
              </p>

              <div className="grid w-full grid-cols-4 gap-5">
                {Object.keys(product.variants[variant]).map(
                  (variantOption, j) => {
                    // variant object contains title field
                    if (variantOption === "title") return null;

                    const isSelected =
                      selectedCombination?.combination[variant] ===
                      product.variants[variant][variantOption].title;

                    return (
                      <div
                        key={j}
                        onClick={() =>
                          changeCombination(
                            variant,
                            product.variants[variant][variantOption].title,
                          )
                        }
                        className={cn(
                          "flex w-full cursor-pointer justify-center border border-black/40 py-1.5 transition-colors hover:border-black hover:bg-accent sm:py-2",
                          isSelected && "border-2 border-black/80 bg-accent",
                        )}
                      >
                        <p
                          className={cn(
                            "font-prim text-sm font-semibold uppercase text-black",
                            isSelected && "",
                          )}
                        >
                          {product.variants[variant][variantOption].title}
                        </p>
                      </div>
                    );
                  },
                )}
              </div>
            </div>
          ))}

        <div className="mt-8 flex flex-col gap-6">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <div className="flex w-full items-center justify-around gap-4 border border-black/40 px-5 py-2 sm:w-fit">
              <Minus
                onClick={() => setQuantity((prev) => prev - 1)}
                className={cn(
                  "h-4 w-4 cursor-pointer text-black",
                  quantity === 1 && "pointer-events-none text-black/70",
                )}
              />

              <p className="font-prim text-base text-black">{quantity}</p>

              <Plus
                onClick={() => setQuantity((prev) => prev + 1)}
                className={cn("h-4 w-4 cursor-pointer text-black")}
              />
            </div>

            <ProductActions
              quantity={quantity}
              productId={product.id}
              favoritedByIds={product.favouritedByIds}
              selectedCombinationId={selectedCombination?.id}
            />
          </div>

          <Link
            href={`${routes.checkout}?${checkoutUrlSearchParams.join("&")}`}
            className={buttonVariants({
              size: "lg",
              className: "rounded-none uppercase",
            })}
          >
            Go For Checkout
          </Link>
        </div>

        <div className="my-2 h-[1px] w-full bg-zinc-300" />

        <div className="mt-6 flex flex-col gap-3">
          <Heading text="Description" />

          <p className="font-roboto text-base text-zinc-700">
            {product.description}
          </p>
        </div>

        {product.listedInformation.map((listedInformation, i) => (
          <div key={i} className="mt-2 flex flex-col gap-3">
            <p className="font-prim text-base font-bold text-black">
              {listedInformation.heading}
            </p>

            <ul className="flex list-disc flex-col gap-4">
              {listedInformation.informationListPoints.map((point, j) => (
                <li
                  key={j}
                  className="font-roboto ml-12 text-base text-zinc-700"
                >
                  {point}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};
