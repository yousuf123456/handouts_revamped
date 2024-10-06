"use server";

import prisma from "@/app/_libs/prismadb";
import { ActionResult } from "@/app/_types";
import { Address, OrderStatus } from "@prisma/client";
import { getPriceInfo } from "@/app/_utils/getPriceInfo";
import { userCartCache, userOrdersCache } from "@/app/_config/cache";
import { userAuthentication } from "@/app/_serverFunctions/userAuthentication";
import { GroupedCheckoutProducts } from "../_components/CheckoutSummary";
import { getGroupedCheckoutProductsTotal } from "../_utils/getGroupedCheckoutProductsTotal";

interface PlaceOrderParams {
  delieveryInfo: {
    billingAddress: Address;
    shippingAddress: Address;
  };
  fromCart: boolean;
  groupedCheckoutProducts: GroupedCheckoutProducts;
}

// Function to extract product IDs from the checkout products
const extractProductIds = (
  groupedCheckoutProducts: GroupedCheckoutProducts,
) => {
  return Object.values(groupedCheckoutProducts).flatMap((group) =>
    group.checkoutProducts.map((checkoutProduct) => checkoutProduct.product.id),
  );
};

// Function to extract applied vouchers IDs from the checkout products
const extractAppliedVoucherIds = (
  groupedCheckoutProducts: GroupedCheckoutProducts,
) => {
  return Object.values(groupedCheckoutProducts)
    .flatMap((group) =>
      group.checkoutProducts.map(
        (checkoutProduct) => checkoutProduct.product.appliedVoucher?.id,
      ),
    )
    .filter((voucherId) => typeof voucherId === "string");
};

// Function to create package data of every store for the order
const createPackageData = (
  groupedCheckoutProducts: GroupedCheckoutProducts,
  userId: string,
) => {
  return Object.values(groupedCheckoutProducts).map((group) => {
    const { totalQuantity, productsTotal, delieveryTotal } =
      getGroupedCheckoutProductsTotal([group]);

    return {
      totalQuantity,
      totalAmmount: productsTotal,
      delieveryFee: delieveryTotal,
      status: "PaymentPending" as OrderStatus,
      customer: {
        connect: { id: userId },
      },
      store: {
        connect: { id: group.checkoutProducts[0].product.storeId },
      },
      orderedProducts: {
        create: group.checkoutProducts.map((checkoutProduct) => {
          const { currentPrice } = getPriceInfo(
            checkoutProduct.product,
            checkoutProduct.selectedCombinationId,
          );

          return {
            status: "PaymentPending" as OrderStatus,
            quantity: checkoutProduct.quantity,
            priceAtOrderTime: currentPrice * checkoutProduct.quantity,
            product: {
              id: checkoutProduct.product.id,
              name: checkoutProduct.product.name,
              image: checkoutProduct.product.image,
              storeId: checkoutProduct.product.storeId,
              category: checkoutProduct.product.category,
              storeName: checkoutProduct.product.storeName,
            },
            store: {
              connect: { id: checkoutProduct.product.storeId },
            },
            customer: {
              connect: { id: userId },
            },
          };
        }),
      },
    };
  });
};

// Main placeOrder function
export const placeOrder = async ({
  fromCart,
  delieveryInfo,
  groupedCheckoutProducts,
}: PlaceOrderParams): Promise<ActionResult> => {
  try {
    const { dbUserId, isUserAuthenticated } = userAuthentication();

    // Check if the user is authenticated
    if (!isUserAuthenticated || !dbUserId) {
      return { success: false, message: "Unauthenticated" };
    }

    const productIds = extractProductIds(groupedCheckoutProducts);
    const appliedVoucherIds = extractAppliedVoucherIds(groupedCheckoutProducts);

    const { totalQuantity, productsTotal, delieveryTotal } =
      getGroupedCheckoutProductsTotal(Object.values(groupedCheckoutProducts));

    const prismaActions = [
      prisma.order.create({
        data: {
          totalQuantity,
          totalAmmount: productsTotal,
          delieveryFee: delieveryTotal,
          billingAddress: delieveryInfo.billingAddress,
          shippingAddress: delieveryInfo.shippingAddress,
          customer: { connect: { id: dbUserId } },
          associatedStores: {
            connect: Object.keys(groupedCheckoutProducts).map((storeId) => ({
              id: storeId,
            })),
          },
          packages: {
            create: createPackageData(groupedCheckoutProducts, dbUserId),
          },
        },
      }),
      prisma.product.updateMany({
        where: {
          id: { in: productIds },
        },
        data: {
          numOfSales: { increment: 1 },
        },
      }),
      prisma.$runCommandRaw({
        findAndModify: "User",
        query: {
          _id: { $oid: dbUserId },
          collectedVouchers: {
            //@ts-ignore
            $elemMatch: { "voucher.id": { $in: appliedVoucherIds } },
          },
        },
        update: {
          $set: { "collectedVouchers.$.used": true },
        },
      }),
    ];

    if (fromCart) {
      prismaActions.push(
        prisma.cartItem.deleteMany({ where: { userId: dbUserId } }),
      );
    }

    // Transaction to create order, update product sales and flush user cart if needed
    await prisma.$transaction(prismaActions);

    if (fromCart) userCartCache.revalidate(dbUserId);
    userOrdersCache.revalidate(dbUserId);

    return { success: true, message: "Successfully placed your order." };
  } catch (error) {
    console.error("Error placing order:", error);

    return { success: false, message: "Something went wrong." };
  }
};
