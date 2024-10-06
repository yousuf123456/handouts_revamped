"use server";

import prisma from "@/app/_libs/prismadb";
import { ActionResult } from "@/app/_types";
import { CancellationRequestStatus, OrderStatus } from "@prisma/client";
import { RequestFormData } from "../_components/OrderRequestForm";
import { UserOrder } from "../../../_serverFunctions/getUserOrders";
import { userAuthentication } from "@/app/_serverFunctions/userAuthentication";
import { userCancellationsCache, userOrdersCache } from "@/app/_config/cache";

function isPackageInInitialStages(packageStatus: OrderStatus) {
  // Also check if payment method is COD and has not paid yet digitally so order can be cancelled instantly
  if (packageStatus === "Processing" || packageStatus === "PaymentPending")
    return true;

  return false;
}

interface cancelOrderedProductsParams {
  requestFormData: RequestFormData;
  orderPackage: UserOrder["packages"][number];
}

export const cancelOrderedProducts = async ({
  requestFormData,
  orderPackage,
}: cancelOrderedProductsParams): Promise<ActionResult> => {
  try {
    const { isUserAuthenticated, dbUserId } = userAuthentication();

    if (!isUserAuthenticated || !dbUserId)
      return { success: false, message: "Unauthorized" };

    const areAllProductsCancelled =
      requestFormData.selectedOrderedProducts.length ===
      orderPackage.orderedProducts.length;

    const cancellationStatus: CancellationRequestStatus =
      isPackageInInitialStages(orderPackage.status)
        ? "Cancelled"
        : "CancellationInProcess";

    const createdCancellationRequest = await prisma.cancellationRequest.create({
      data: {
        feedback: requestFormData.feedback,
        status: cancellationStatus,
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
            status: cancellationStatus,
            cancellationReason: p.reason,
            cancellationRequestId: createdCancellationRequest.id,
          },
        }),
      );

    await prisma.$transaction([
      ...(areAllProductsCancelled
        ? [
            prisma.package.update({
              where: { id: orderPackage.id },
              data: { status: cancellationStatus },
            }),
          ]
        : []),
      ...updateOrderedProductOperations,
    ]);

    userCancellationsCache.revalidate(dbUserId); // Revalidate the user cancellations cached data
    userOrdersCache.revalidate(dbUserId); // Revalidate the user orders cached data

    return {
      success: true,
      message:
        cancellationStatus === "Cancelled"
          ? `Succefully cancelled your products order.`
          : "Your ordered products will be cancelled after review. Please be patient.",
    };
  } catch (e) {
    console.log("Error: ", e);
    return {
      success: false,
      message: "Something went wrng.",
    };
  }
};
