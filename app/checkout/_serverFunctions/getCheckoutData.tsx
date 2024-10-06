import prisma from "@/app/_libs/prismadb";

import getDBUser from "@/app/_serverActions/getDBUser";
import { getUserCart } from "@/app/_serverFunctions/getUserCart";
import { Product, PromoToolsBucket, Voucher } from "@prisma/client";

interface getCheckoutDataProps {
  fromCart: boolean;
  quantity?: number;
  productId?: string;
  selectedCombinationId?: string;
}

export type CheckoutProduct = {
  quantity: number;
  selectedCombinationId: string | null;
  product: Pick<
    Product,
    | "id"
    | "name"
    | "image"
    | "price"
    | "storeId"
    | "storeName"
    | "promoPrice"
    | "combinations"
    | "category"
    | "promoPriceEndingDate"
    | "promoPriceStartingDate"
  > & {
    appliedVoucher?: Voucher;
    // [key: string]: any;
  };
} & { [key: string]: any };

export const getCheckoutData = async ({
  fromCart,
  quantity,
  productId,
  selectedCombinationId,
}: getCheckoutDataProps) => {
  const { user, auth } = await getDBUser({
    includeFields: { collectedVouchers: true },
  });

  if (!user || !auth.sessionId || !auth.userId)
    return {
      checkoutProducts: [] as CheckoutProduct[],
      freeShippings: null,
      collectedVouchers: null,
    };

  let checkoutProducts: CheckoutProduct[];

  if (fromCart) {
    //Get all the cart products
    const userCart = await getUserCart({ dbUserId: user.id });
    checkoutProducts = userCart;
  } else {
    if (!quantity)
      return {
        checkoutProducts: [] as CheckoutProduct[],
        collectedVouchers: null,
        freeShippings: null,
      };

    // Get indivisual product from id provided
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: {
        id: true,
        name: true,
        image: true,
        price: true,
        storeId: true,
        category: true,
        storeName: true,
        promoPrice: true,
        combinations: true,
        favouritedByIds: true,
        promoPriceEndingDate: true,
        promoPriceStartingDate: true,
      },
    });

    if (!product)
      return {
        checkoutProducts: [] as CheckoutProduct[],
        collectedVouchers: null,
        freeShippings: null,
      };

    checkoutProducts = [
      {
        product,
        quantity,
        selectedCombinationId: selectedCombinationId || null,
      },
    ];
  }

  const checkoutProductIds = checkoutProducts.map(
    (checkoutProduct) => checkoutProduct.product.id,
  );

  const checkoutProductsStoreIds = checkoutProducts.map(
    (checkoutProduct) => checkoutProduct.product.storeId,
  );

  const userCollectedVouchers = user.collectedVouchers
    .filter((collV) => {
      if (
        !collV.used &&
        checkoutProductsStoreIds.includes(collV.voucher.storeId) &&
        (collV.voucher.applicableOn === "EntireStore" ||
          collV.voucher.productIds.some((pId) =>
            checkoutProductIds.includes(pId),
          ))
      )
        return true;

      return false;
    })
    .map((collV) => collV.voucher);

  const storesPromoBuckets = (
    await prisma.promoToolsBucket.findMany({
      where: {
        storeId: {
          in: checkoutProductsStoreIds,
        },
      },
      select: {
        freeShipping: true,
        storeId: true,
        id: true,
      },
    })
  ).map((bucket) => {
    const freeShipping = bucket.freeShipping.filter((freeShipping) => {
      if (
        freeShipping.applicableOn === "EntireStore" ||
        freeShipping.productIds.some((pId) => checkoutProductIds.includes(pId))
      )
        return true;

      return false;
    });

    return { ...bucket, freeShipping };
  });

  return {
    checkoutProducts,
    freeShippings: storesPromoBuckets,
    collectedVouchers: userCollectedVouchers,
  };
};
