import { storeRecordCache } from "@/app/_config/cache";
import prisma from "@/app/_libs/prismadb";
import { unstable_cache } from "next/cache";

type getStoreParams = {
  storeId: string;
};

export const getStore = async ({ storeId }: getStoreParams) => {
  const store = await prisma.store.findUnique({
    where: { id: storeId },
    select: {
      id: true,
      name: true,
      logo: true,
      createdAt: true,
      description: true,
      productCollections: true,
    },
  });

  return store;
};

export const getCachedStore = async (params: getStoreParams) => {
  return unstable_cache(getStore, storeRecordCache.keys, {
    tags: storeRecordCache.tags(params.storeId),
    revalidate: storeRecordCache.duration,
  })(params);
};
