import { auth } from "@clerk/nextjs/server";

export const userAuthentication = () => {
  const { userId, sessionId, sessionClaims } = auth();

  const isUserAuthenticated = userId && sessionId && sessionClaims.dbUserId;

  return {
    authUserId: userId,
    isUserAuthenticated,
    dbUserId: sessionClaims?.dbUserId,
  };
};
