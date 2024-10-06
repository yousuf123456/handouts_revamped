import React from "react";

import { unstable_cache } from "next/cache";
import { auth } from "@clerk/nextjs/server";

import Link from "next/link";
import { Heart } from "lucide-react";
import { routes } from "@/app/_config/routes";
import { Button } from "@/components/ui/button";
import { FavoriteItemsList } from "./FavoriteItemsList";
import { userFavoritesCache } from "@/app/_config/cache";
import { EmptyState } from "@/app/_components/EmptyState";
import { getUserFavorites } from "../_serverFunctions/getUserFavorites";

export const UserFavorites = async () => {
  const { sessionClaims } = auth();
  if (!sessionClaims || !sessionClaims.dbUserId) return "Unauthorized";

  const userFavorites = await unstable_cache(
    getUserFavorites,
    userFavoritesCache.keys,
    {
      tags: userFavoritesCache.tags(sessionClaims.dbUserId),
      revalidate: userFavoritesCache.revalidateDuration,
    },
  )({
    dbUserId: sessionClaims.dbUserId,
  });

  if (userFavorites.length === 0)
    return (
      <EmptyState
        Icon={Heart}
        actionLabel="Your journey begins with the first item. Start exploring our
          collection to find something special."
        heading="Empty Favorites"
      >
        <Link href={routes.home}>
          <Button size={"lg"} variant={"corners"} className="w-full uppercase">
            Browse Products
          </Button>
        </Link>
      </EmptyState>
    );

  return <FavoriteItemsList favoriteItems={userFavorites} />;
};
