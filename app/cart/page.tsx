import React from "react";
import { UserCart } from "./_components/UserCart";

export default async function CartPage() {
  return (
    <div className="mx-auto w-full max-w-screen-xl px-4 py-8 md:py-12">
      <h1 className="mb-8 text-center text-2xl font-medium uppercase">
        Your Cart
      </h1>
      <UserCart />
    </div>
  );
}
