"use server";

import prisma from "../_libs/prismadb";
import { unstable_cache } from "next/cache";
import { userRecordCache } from "../_config/cache";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { ExtendedUserOnlyKeys, UserType } from "../_types";

type getDBUserParams = {
  includeFields?: Partial<Record<ExtendedUserOnlyKeys, boolean>>;
};

export default async function getDBUser<T extends getDBUserParams>(
  params?: T,
): Promise<{ auth: ReturnType<typeof auth>; user: UserType<T> | null }> {
  const authState = auth();

  if (!authState.sessionId || !authState.userId)
    return { auth: authState, user: null };

  const user = (await unstable_cache(fetchUserFromDB, userRecordCache.keys, {
    tags: userRecordCache.tags(authState.sessionClaims.dbUserId),
    revalidate: userRecordCache.duration,
  })({
    dbUserId: authState.sessionClaims.dbUserId,
    includeFields: params?.includeFields,
    authUserId: authState.userId,
  })) as UserType<T> | null;

  if (!user) return { auth: authState, user: null };

  return { user, auth: authState };
}

const fetchUserFromDB = async <
  T extends getDBUserParams & { dbUserId: string; authUserId: string },
>({
  includeFields,
  authUserId,
  dbUserId,
}: T) => {
  if (!dbUserId || !authUserId) return null;

  const user = (await prisma.user.findUnique({
    where: {
      id: dbUserId,
      authUserId: authUserId,
    },
    select: {
      id: true,
      authUserId: true,
      addressDiary: true,
      favouriteItemIds: true,
      ...(includeFields ? includeFields || {} : {}),
    },
  })) as UserType<T> | null;

  if (!user) {
    const createdUser = (await prisma.user.create({
      data: {
        authUserId: authUserId,
      },
      select: {
        id: true,
        authUserId: true,
        addressDiary: true,
        favouriteItemIds: true,
        ...(includeFields ? includeFields || {} : {}),
      },
    })) as UserType<T>;

    await clerkClient.users.updateUserMetadata(authUserId, {
      publicMetadata: { dbUserId: createdUser.id },
    });

    return user;
  }

  return user;
};
