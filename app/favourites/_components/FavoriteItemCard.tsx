import React from "react";

import { getUserFavorites } from "../_serverFunctions/getUserFavorites";
import { getPriceInfo } from "@/app/_utils/getPriceInfo";
import { Button } from "@/components/ui/button";
import { Plus, ShoppingCart, Trash2 } from "lucide-react";
import { ProductImage } from "@/app/_components/ProductImage";
import Link from "next/link";
import { routes } from "@/app/_config/routes";

type FavoriteItem = Awaited<ReturnType<typeof getUserFavorites>>[number];

interface FavoriteItemCardProps {
  favoriteItem: FavoriteItem;
  setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setDialogAction: React.Dispatch<
    React.SetStateAction<{
      actionDescription: string;
      favoriteItem: FavoriteItem;
      type: "delete" | "cart";
      action: string;
    } | null>
  >;
}

export const FavoriteItemCard = ({
  favoriteItem,
  setDialogOpen,
  setDialogAction,
}: FavoriteItemCardProps) => {
  const defaultCombinationId = favoriteItem.combinations.filter(
    (combination) => !!combination.default,
  )[0]?.id;

  const { currentPrice, originalPrice } = getPriceInfo(
    favoriteItem,
    defaultCombinationId,
  );

  return (
    <div className="flex flex-col gap-2">
      <p className="mb-3 text-sm uppercase underline">
        {favoriteItem.storeName}
      </p>

      <div className="mb-4 flex flex-col gap-4 border-b pb-4 min-[500px]:flex-row min-[500px]:items-center">
        <div className="flex flex-1 items-center gap-4">
          <Link href={routes.productDetails(favoriteItem.id)}>
            <div className="relative h-20 w-20 overflow-hidden rounded sm:h-24 sm:w-24">
              <ProductImage src={favoriteItem.image} alt="Product Image" fill />
            </div>
          </Link>

          <Link
            href={routes.productDetails(favoriteItem.id)}
            className="flex-grow"
          >
            <div>
              <h3 className="text-sm uppercase">{favoriteItem.name}</h3>

              <div className="mt-1 flex items-center gap-1">
                <h2 className="font-prim text-lg">Rs. {currentPrice}</h2>

                <p className="font-prim text-sm text-black/80 line-through">
                  Rs. {originalPrice}
                </p>
              </div>
            </div>
          </Link>
        </div>

        <div className="flex gap-0 min-[500px]:flex-col">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => {
              setDialogOpen(true);
              setDialogAction({
                favoriteItem,
                type: "delete",
                action: "Remove",
                actionDescription:
                  "Are you sure you want to remove this product from your favorites?",
              });
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            // className={cn(isFavorited && "pointer-events-none")}
            onClick={() => {
              setDialogOpen(true);
              setDialogAction({
                favoriteItem,
                type: "cart",
                action: "Add To Cart",
                actionDescription:
                  "Are you sure you want to add this product to your cart?",
              });
            }}
          >
            <ShoppingCart className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
