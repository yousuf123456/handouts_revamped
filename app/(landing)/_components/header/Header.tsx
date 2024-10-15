import React from "react";
import prisma from "@/app/_libs/prismadb";

import { HeaderContent } from "./HeaderContent";
import { unstable_cache } from "next/cache";
import { allCategoriesCache } from "@/app/_config/cache";

const getAllCategories = async () => {
  return await prisma.category.findMany();
};

export const Header = async () => {
  const categories = await unstable_cache(
    getAllCategories,
    allCategoriesCache.keys,
    {
      revalidate: allCategoriesCache.duration,
      tags: allCategoriesCache.tags,
    },
  )();

  return <HeaderContent categories={categories} />;
};
