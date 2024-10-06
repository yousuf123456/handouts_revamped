"use client";
import { useEffect, useState } from "react";

import getDBUser from "../_serverActions/getDBUser";

import { useAuth } from "@clerk/nextjs";
import { ExtendedUserOnlyKeys, UserType } from "../_types";

function useDBUser<
  T extends {
    includeFields?: Partial<Record<ExtendedUserOnlyKeys, boolean>>;
  },
>(
  options?: T,
): {
  isSignedIn: boolean | undefined;
  user: UserType<T> | null;
  isLoaded: boolean;
} {
  const { isSignedIn, isLoaded } = useAuth();
  const [user, setUser] = useState<UserType<T> | null>(null);

  useEffect(() => {
    if (!isLoaded || isSignedIn === undefined) return;

    const fetchUser = async () => {
      try {
        const { user, auth } = await getDBUser(options);

        if (!auth.sessionId || !auth.userId || !user) return;

        setUser(user);
      } catch (error) {
        setUser(null);
      }
    };

    fetchUser();
  }, [isSignedIn, isLoaded]);

  return { isLoaded, isSignedIn, user };
}

export default useDBUser;
