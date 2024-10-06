import { ReadonlyURLSearchParams } from "next/navigation";

export const routes = {
  home: "/",
  cart: "/cart",
  signIn: "/sign-in",
  signUp: "/sign-up",
  checkout: "/checkout",
  favorites: "/favourites",
  searchProducts: "/search",
  orders: "/dashboard/orders",
  addAddress: "/dashboard/addAddress",
  returnedOrders: "/dashboard/returns",
  writeReview: "/dashboard/writeReview",
  addressDiary: "/dashboard/addressDiary",
  pendingReviews: "/dashboard/pendingReviews",
  cancelledOrders: "/dashboard/cancellations",
  publishedReviews: "/dashboard/publishedReviews",
  storeDetails: (storeId: string) => `/sellers/${storeId}`,
  productDetails: (productId: string) => `/products/${productId}`,
  orderDetails: (orderId: string) => `/dashboard/orders/${orderId}`,
  cancellationDetails: (cancellationId: string) =>
    `/dashboard/cancellations/${cancellationId}`,
  returnDetails: (cancellationId: string) =>
    `/dashboard/returns/${cancellationId}`,
  orderRequests: (orderId: string) =>
    `/dashboard/orders/${orderId}/order-requests`,
  productReviews: (productId: string) =>
    `/products/${productId}/customer-reviews`,
  productQuestions: (productId: string) =>
    `/products/${productId}/customer-questions`,
};

export const BASE_URL =
  process.env.NODE_ENV === "production"
    ? process.env.API_URL
    : "http://localhost:3000/";

export const getSignInUrl = (
  pathname: string,
  searchParams: ReadonlyURLSearchParams,
) => {
  return `${routes.signIn}?redirect_url=${encodeURIComponent(
    absoluteUrl(`${pathname}?${searchParams}`),
  )}`;
};

export const getSignUpUrl = (
  pathname: string,
  searchParams: ReadonlyURLSearchParams,
) => {
  return `${routes.signUp}?redirect_url=${encodeURIComponent(
    absoluteUrl(`${pathname}?${searchParams}`),
  )}`;
};

export const absoluteUrl = (pathname: string) => {
  if (process.env.NODE_ENV === "production")
    return `https://handouts-revamped.vercel.app${pathname}`;
  return `http://localhost:${process.env.PORT ?? 3000}${pathname}`;
};
