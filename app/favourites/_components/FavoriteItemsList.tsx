"use client";
import React, { useState } from "react";

import { toast } from "sonner";
import { FavoriteItemCard } from "./FavoriteItemCard";
import { ActionResult } from "@/app/_types";
import { ActionsConfirmation } from "@/app/_components/ActionsConfirmation";
import { deleteFavoriteItem } from "../_serverActions/deleteFavoriteItem";
import { getUserFavorites } from "../_serverFunctions/getUserFavorites";
import { addToCart } from "../../_serverActions/addToCart";

type FavoriteItems = Awaited<ReturnType<typeof getUserFavorites>>;

type FavoriteItemsListProps = {
  favoriteItems: FavoriteItems;
};

export const FavoriteItemsList = ({
  favoriteItems,
}: FavoriteItemsListProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const [dialogAction, setDialogAction] = useState<{
    action: string;
    type: "delete" | "cart";
    actionDescription: string;
    favoriteItem: FavoriteItems[number];
  } | null>(null);

  const handleConfirmAction = async () => {
    if (!dialogAction) return;

    const defaultCombinationId = dialogAction.favoriteItem.combinations.filter(
      (combination) => !!combination.default,
    )[0]?.id as string | undefined;

    let actionPromise: Promise<ActionResult>;

    if (dialogAction?.type === "delete") {
      actionPromise = deleteFavoriteItem({
        favoriteItemId: dialogAction.favoriteItem.id,
      });
    } else
      actionPromise = addToCart({
        quantity: 1,
        productId: dialogAction.favoriteItem.id,
        selectedCombinationId: defaultCombinationId,
      });

    toast.promise(actionPromise, {
      loading:
        dialogAction.type === "delete"
          ? "Deleting product from favorites"
          : "Adding product to your cart",
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
    <div className="flex w-full flex-col gap-4">
      {favoriteItems.map((favoriteItem, i) => (
        <FavoriteItemCard
          key={i}
          favoriteItem={favoriteItem}
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
