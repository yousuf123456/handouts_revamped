export {};

declare global {
  interface CustomJwtSessionClaims {
    dbUserId: string;
  }
}
