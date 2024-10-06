import React from "react";
import { unstable_cache } from "next/cache";

import { getUserCart } from "@/app/_serverFunctions/getUserCart";

import Link from "next/link";
import { CartTotal } from "./CartTotal";
import { auth } from "@clerk/nextjs/server";
import { ShoppingCart } from "lucide-react";
import { routes } from "@/app/_config/routes";
import { CartItemsList } from "./CartItemsList";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/app/_components/EmptyState";
import { userCartCache } from "@/app/_config/cache";

export const UserCart = async () => {
  const { sessionClaims } = auth();
  if (!sessionClaims) return "Unauthorized";

  const cartItems = await unstable_cache(getUserCart, userCartCache.keys, {
    tags: userCartCache.tags(sessionClaims.dbUserId),
    revalidate: userCartCache.revalidateDuration,
  })({ dbUserId: sessionClaims.dbUserId });

  if (cartItems.length === 0)
    return (
      <EmptyState
        Icon={ShoppingCart}
        heading="Empty Cart"
        actionLabel=" Your journey begins with the first item. Start exploring our
          collection to find something special."
      >
        <Link href={routes.home}>
          <Button size={"lg"} variant={"corners"} className="w-full uppercase">
            Browse Products
          </Button>
        </Link>
      </EmptyState>
    );

  return (
    <div className="flex flex-col gap-8 lg:flex-row">
      <div className="bg-white lg:w-2/3">
        <CartItemsList cartItems={cartItems} />
      </div>

      <div className="lg:w-1/3">
        <CartTotal cartItems={cartItems} />
      </div>
    </div>
  );
};
