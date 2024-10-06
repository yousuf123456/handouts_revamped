"use client";
import { toast } from "sonner";
import React, { useState } from "react";
import { ActionResult } from "@/app/_types";
import { CartItemCard } from "./CartItemCard";
import { getUserCart } from "@/app/_serverFunctions/getUserCart";
import { deleteCartItem } from "../_serverActions/deleteCartItem";
import { addToFavorites } from "../../_serverActions/addToFavorites";
import { ActionsConfirmation } from "../../_components/ActionsConfirmation";

type CartItems = Awaited<ReturnType<typeof getUserCart>>;

type CartItemsListProps = {
  cartItems: CartItems;
};

export const CartItemsList = ({ cartItems }: CartItemsListProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const [dialogAction, setDialogAction] = useState<{
    type: "delete" | "favorite";
    cartItem: CartItems[number];
    actionDescription: string;
    action: string;
  } | null>(null);

  const handleConfirmAction = async () => {
    if (!dialogAction) return;

    let actionPromise: Promise<ActionResult>;

    if (dialogAction?.type === "delete") {
      actionPromise = deleteCartItem({ cartItemId: dialogAction.cartItem.id });
    } else
      actionPromise = addToFavorites({
        productId: dialogAction.cartItem.product.id,
      });

    toast.promise(actionPromise, {
      loading:
        dialogAction.type === "delete"
          ? "Deleting product from cart"
          : "Adding product to your favourites",
      success(data) {
        if (data.success) return data.message;
        else throw new Error(data.message);
      },
      error(data) {
        return data.message;
      },
    });

    await actionPromise;

    setDialogOpen(false);
    setDialogAction(null);
  };

  return (
    <div className="flex flex-col gap-4">
      {cartItems.map((cartItem, i) => (
        <CartItemCard
          key={i}
          cartItem={cartItem}
          setDialogOpen={setDialogOpen}
          setDialogAction={setDialogAction}
        />
      ))}

      <ActionsConfirmation
        dialogOpen={dialogOpen}
        dialogAction={dialogAction}
        setDialogOpen={setDialogOpen}
        handleConfirmAction={handleConfirmAction}
      />
    </div>
  );
};
