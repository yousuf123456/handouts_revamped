"use client";
import React, { useState } from "react";

import { cn } from "@/app/_utils/cn";
import { Button } from "@/components/ui/button";
import { addToCart } from "@/app/_serverActions/addToCart";
import { addToFavorites } from "@/app/_serverActions/addToFavorites";
import { toast } from "sonner";
import { FaHeart } from "react-icons/fa";
import { FiHeart } from "react-icons/fi";
import { useSession } from "@clerk/nextjs";
import { IconWrapper } from "@/app/(landing)/_components/newHeader/components/IconWrapper";

type ProductActionsProps = Parameters<typeof addToCart>[number] &
  Parameters<typeof addToFavorites>[number] & {
    favoritedByIds: string[];
  };

export const ProductActions = (props: ProductActionsProps) => {
  const dbUserId = useSession().session?.user.publicMetadata.dbUserId;
  const alreadyFavorited = props.favoritedByIds.some((id) => id === dbUserId);

  const [isAlreadyFavorited, setIsAlreadyFavorited] =
    useState(alreadyFavorited);

  const [isPerformingAction, setIsPerformingAction] = useState(false);

  const onAddToCart = async () => {
    setIsPerformingAction(true);

    const promise = addToCart({
      quantity: props.quantity,
      productId: props.productId,
      selectedCombinationId: props.selectedCombinationId,
    });

    toast.promise(promise, {
      loading: "Adding product to your cart",
      success(data) {
        if (data.success) return data.message;
        else throw new Error(data.message);
      },
      error(data) {
        return data.message;
      },
      finally() {
        setIsPerformingAction(false);
      },
    });
  };

  const onAddToFavorites = async () => {
    setIsPerformingAction(true);

    const promise = addToFavorites({
      productId: props.productId,
    });

    toast.promise(promise, {
      loading: "Adding product to your favorites",
      success(data) {
        if (data.success) return data.message;
        else throw new Error(data.message);
      },
      error(data) {
        return data.message;
      },
      finally() {
        setIsAlreadyFavorited(true);
        setIsPerformingAction(false);
      },
    });
  };

  return (
    <div className="flex flex-grow items-center gap-6">
      <Button
        variant={"corners"}
        onClick={onAddToCart}
        disabled={isPerformingAction}
        className="w-full text-sm uppercase"
      >
        Add to Cart
      </Button>

      <IconWrapper
        label="Add To Favourites"
        onClick={onAddToFavorites}
        className={cn(
          (isPerformingAction || isAlreadyFavorited) && "pointer-events-none",
        )}
      >
        {isAlreadyFavorited && <FaHeart className="h-4 w-4 text-black/90" />}
        {!isAlreadyFavorited && <FiHeart className="h-4 w-4 text-black/90" />}
      </IconWrapper>
    </div>
  );
};
