import React from "react";
import { UserFavorites } from "./_components/UserFavorites";

export default function FavouritesPage() {
  return (
    <div className="mx-auto w-full max-w-screen-lg px-4 py-8 md:py-12">
      <h1 className="mb-8 text-center text-2xl font-medium uppercase">
        Your Favorites
      </h1>
      <UserFavorites />
    </div>
  );
}
