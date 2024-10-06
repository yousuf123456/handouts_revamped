"use server";

import prisma from "@/app/_libs/prismadb";
import { ActionResult } from "@/app/_types";
import { RequestFormData } from "../_components/OrderRequestForm";
import { UserOrder } from "../../../_serverFunctions/getUserOrders";
import { userAuthentication } from "@/app/_serverFunctions/userAuthentication";
import { userOrdersCache, userReturnsCache } from "@/app/_config/cache";

interface returnOrderedProductsParams {
  orderPackage: UserOrder["packages"][number];
  requestFormData: Omit<RequestFormData, "proofImages"> & {
    proofImages: string[];
  };
}

export const returnOrderedProducts = async ({
  requestFormData,
  orderPackage,
}: returnOrderedProductsParams): Promise<ActionResult> => {
  try {
    const { isUserAuthenticated, dbUserId } = userAuthentication();

    if (!isUserAuthenticated || !dbUserId)
      return { success: false, message: "Unauthorized" };

    const areAllProductsReturned =
      requestFormData.selectedOrderedProducts.length ===
      orderPackage.orderedProducts.length;

    const createdReturnRequest = await prisma.returnRequest.create({
      data: {
        feedback: requestFormData.feedback,
        proofImages: requestFormData.proofImages,
        status: "ReturnInProcess",
        requester: {
          connect: {
            id: dbUserId,
          },
        },
        order: {
          connect: {
            id: orderPackage.orderId,
          },
        },
        store: {
          connect: {
            id: orderPackage.storeId,
          },
        },
      },
    });

    const updateOrderedProductOperations =
      requestFormData.selectedOrderedProducts.map((p) =>
        prisma.orderedProduct.update({
          where: { id: p.id },
          data: {
            returnReason: p.reason,
            status: "ReturnInProcess",
            returnRequestId: createdReturnRequest.id,
          },
        }),
      );

    await prisma.$transaction([
      ...(areAllProductsReturned
        ? [
            prisma.package.update({
              where: { id: orderPackage.id },
              data: { status: "ReturnInProcess" },
            }),
          ]
        : []),
      ...updateOrderedProductOperations,
    ]);

    userOrdersCache.revalidate(dbUserId); // Revalidare the user orders cached data
    userReturnsCache.revalidate(dbUserId); // Revalidate the user returns cached data

    return {
      success: true,
      message:
        "Your ordered products will be returned after review. Please be patient.",
    };
  } catch (e) {
    console.log("Error: ", e);
    return {
      success: false,
      message: "Something went wrng.",
    };
  }
};
