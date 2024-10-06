import React, { useState } from "react";

import { cn } from "@/app/_utils/cn";
import { getUserCart } from "@/app/_serverFunctions/getUserCart";
import { getPriceInfo } from "@/app/_utils/getPriceInfo";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2 } from "lucide-react";
import { ProductImage } from "@/app/_components/ProductImage";
import { updateCartItemQuantity } from "../_serverActions/updateCartItemQuantity";

import { toast } from "sonner";
import { FiHeart } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import { useSession } from "@clerk/nextjs";
import { routes } from "@/app/_config/routes";
import { ProductCombination } from "@prisma/client";

type CartItem = Awaited<ReturnType<typeof getUserCart>>[number];

interface CartItemCardProps {
  cartItem: CartItem;
  setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setDialogAction: React.Dispatch<
    React.SetStateAction<{
      type: "delete" | "favorite";
      actionDescription: string;
      cartItem: CartItem;
      action: string;
    } | null>
  >;
}

export const CartItemCard = ({
  cartItem,
  setDialogOpen,
  setDialogAction,
}: CartItemCardProps) => {
  const [isUpdatingQuantity, setIsUpdatingQuantity] = useState(false);

  const { currentPrice, originalPrice } = getPriceInfo(
    cartItem.product,
    cartItem.selectedCombinationId,
  );

  const onUpdateCartItemQuantity = async ({
    isIncrement,
  }: {
    isIncrement: boolean;
  }) => {
    setIsUpdatingQuantity(true);

    const actionPromise = updateCartItemQuantity({
      cartItemId: cartItem.id,
      isIncrement,
    });

    toast.promise(actionPromise, {
      loading: "Updating product quantity",
      success(data) {
        if (data.success) return data.message;
        else throw new Error(data.message);
      },
      error(data) {
        return data.message;
      },
    });

    await actionPromise;

    setIsUpdatingQuantity(false);
  };

  const { session } = useSession();

  const userId = session?.user.publicMetadata.dbUserId;
  const isFavorited = cartItem.product.favouritedByIds.some(
    (favById) => favById === userId,
  );

  const selectedCombination = cartItem.product.combinations.filter(
    (combination) => combination.id === cartItem.selectedCombinationId,
  )[0] as ProductCombination | undefined;

  return (
    <div className="flex flex-col gap-2">
      <p className="mb-3 text-sm uppercase underline">
        {cartItem.product.storeName}
      </p>

      <div className="mb-4 flex flex-col gap-4 border-b pb-4 min-[500px]:flex-row min-[500px]:items-center">
        <div className="flex flex-1 items-center gap-4">
          <Link href={routes.productDetails(cartItem.product.id)}>
            <div className="relative h-20 w-20 overflow-hidden rounded sm:h-24 sm:w-24">
              <ProductImage
                src={cartItem.product.image}
                alt="Product Image"
                fill
              />
            </div>
          </Link>

          <div className="flex-grow">
            <Link href={routes.productDetails(cartItem.product.id)}>
              <h3 className="text-sm uppercase">{cartItem.product.name}</h3>

              <div className="mt-1 flex items-center gap-2">
                <h2 className="font-prim text-lg">
                  Rs. {currentPrice * cartItem.quantity}
                </h2>

                <p className="font-prim text-sm text-black/80 line-through">
                  Rs. {originalPrice}
                </p>
              </div>
            </Link>

            <div className="mt-3 flex w-fit items-center justify-around gap-4 border border-black/40 px-2.5 py-0.5">
              <Minus
                onClick={() => onUpdateCartItemQuantity({ isIncrement: false })}
                className={cn(
                  "h-4 w-4 cursor-pointer text-black",
                  cartItem.quantity === 1 &&
                    "pointer-events-none text-black/50",
                  isUpdatingQuantity && "pointer-events-none text-black/50",
                )}
              />

              <p className="font-prim text-base text-black">
                {cartItem.quantity}
              </p>

              <Plus
                onClick={() => onUpdateCartItemQuantity({ isIncrement: true })}
                className={cn(
                  "h-4 w-4 cursor-pointer text-black",
                  isUpdatingQuantity && "pointer-events-none text-black/50",
                )}
              />
            </div>
          </div>
        </div>

        <div className="flex gap-0 min-[500px]:flex-col">
          <Button
            size="icon"
            variant="ghost"
            className={cn(isFavorited && "pointer-events-none")}
            onClick={() => {
              setDialogOpen(true);
              setDialogAction({
                cartItem,
                type: "favorite",
                action: "Add To Favorites",
                actionDescription:
                  "Are you sure you want to add this item to your favorites?",
              });
            }}
          >
            {isFavorited && <FaHeart className="h-4 w-4" />}
            {!isFavorited && <FiHeart className="h-4 w-4" />}
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => {
              setDialogOpen(true);
              setDialogAction({
                cartItem,
                type: "delete",
                action: "Remove",
                actionDescription:
                  "Are you sure you want to remove this item from your cart?",
              });
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
