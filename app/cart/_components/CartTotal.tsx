import React from "react";

import { Info, ShoppingBag } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { getUserCart } from "@/app/_serverFunctions/getUserCart";
import { getPriceInfo } from "@/app/_utils/getPriceInfo";
import Link from "next/link";
import { routes } from "@/app/_config/routes";

type CartItems = Awaited<ReturnType<typeof getUserCart>>;

type CartTotalProps = {
  cartItems: CartItems;
};

export const CartTotal = ({ cartItems }: CartTotalProps) => {
  const total = getCartTotal(cartItems);

  return (
    <div className="mx-auto max-w-lg rounded-lg bg-gray-50 p-6 shadow-sm">
      <h2 className="mb-4 text-xl font-semibold">Cart Summary</h2>
      <div className="mb-2 flex justify-between text-sm">
        <span className="text-gray-600">Subtotal</span>
        <span>Rs. {total}</span>
      </div>
      <div className="mb-2 flex justify-between text-sm">
        <span className="text-gray-600">Shipping</span>
        <span>At Checkout</span>
      </div>
      <div className="mt-4 flex items-center gap-2">
        <Info className="h-3.5 w-3.5 flex-shrink-0" />
        <p className="text-xs text-black">
          All applicable vouchers will be applied to your products during
          checkout
        </p>
      </div>
      <div className="mt-4 flex justify-between border-t pt-4 text-lg font-semibold">
        <span>Total</span>
        <span>Rs. {total}</span>
      </div>
      <Link
        href={`${routes.checkout}?fromCart=true`}
        className={buttonVariants({ className: "mt-6 w-full", size: "lg" })}
      >
        <ShoppingBag className="mr-2 h-5 w-5" /> Checkout
      </Link>
    </div>
  );
};

function getCartTotal(cartItems: CartItems) {
  let total = 0;

  cartItems.map((cartItem) => {
    const { currentPrice } = getPriceInfo(cartItem.product);

    total += currentPrice * cartItem.quantity;
  });

  return total;
}
