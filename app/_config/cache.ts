import { revalidateTag } from "next/cache";

export const userCartCache = {
  keys: [],
  revalidateDuration: 3600,
  tags: (dbUserId: string) => [`user:${dbUserId}-cart`],
  revalidate: (dbUserId: string) => revalidateTag(`user:${dbUserId}-cart`),
};

export const userFavoritesCache = {
  keys: [],
  revalidateDuration: 3600,
  tags: (dbUserId: string) => [`user:${dbUserId}-favorites`],
  revalidate: (dbUserId: string) => revalidateTag(`user:${dbUserId}-favorites`),
};

export const productQuestionsCache = {
  keys: [],
  revalidateDuration: 3600,
  tags: (productId: string) => [`product:${productId}-questions`],
  revalidate: (productId: string) =>
    revalidateTag(`product:${productId}-questions`),
};

export const productReviewsCache = {
  keys: [],
  revalidateDuration: 3600,
  tags: (productId: string) => [`product:${productId}-reviews`],
  revalidate: (productId: string) =>
    revalidateTag(`product:${productId}-reviews`),
};

export const userOrdersCache = {
  keys: [],
  duration: 3600,
  tags: (dbUserId: string) => [`user:${dbUserId}-orders`],
  revalidate: (dbUserId: string) => revalidateTag(`user:${dbUserId}-orders`),
};

export const userCancellationsCache = {
  keys: [],
  duration: 3600,
  tags: (dbUserId: string) => [`user:${dbUserId}-cancellations`],
  revalidate: (dbUserId: string) =>
    revalidateTag(`user:${dbUserId}-cancellations`),
};

export const userReturnsCache = {
  keys: [],
  duration: 3600,
  tags: (dbUserId: string) => [`user:${dbUserId}-returns`],
  revalidate: (dbUserId: string) => revalidateTag(`user:${dbUserId}-returns`),
};

export const userReviewsCache = {
  keys: [],
  duration: 3600,
  tags: (dbUserId: string) => [`user:${dbUserId}-reviews`],
  revalidate: (dbUserId: string) => revalidateTag(`user:${dbUserId}-reviews`),
};

export const userPendingReviewsCache = {
  keys: [],
  duration: 3600,
  tags: (dbUserId: string) => [`user:${dbUserId}-pendingReviews`],
  revalidate: (dbUserId: string) =>
    revalidateTag(`user:${dbUserId}-pendingReviews`),
};

export const userRecordCache = {
  keys: [],
  duration: 3600,
  tags: (dbUserId: string) => [`user:${dbUserId}`],
  revalidate: (dbUserId: string) => revalidateTag(`user:${dbUserId}`),
};

export const storeRecordCache = {
  keys: [],
  duration: 3600,
  tags: (storeId: string) => [`store:${storeId}`],
  revalidate: (storeId: string) => revalidateTag(`store:${storeId}`),
};

export const storeProductsCache = {
  keys: [],
  duration: 3600,
  tags: (storeId: string) => [`store:${storeId}-products`],
  revalidate: (storeId: string) => revalidateTag(`store:${storeId}-products`),
};

export const storeCollectionProductsCache = {
  keys: [],
  duration: 3600,
  tags: (storeId: string) => [`store:${storeId}-collectionProducts`],
  revalidate: (storeId: string) =>
    revalidateTag(`store:${storeId}-collectionProducts`),
};
