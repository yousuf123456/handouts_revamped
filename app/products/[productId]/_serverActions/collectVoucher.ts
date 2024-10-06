"use server";

import prisma from "@/app/_libs/prismadb";

import { userAuthentication } from "@/app/_serverFunctions/userAuthentication";

import { Voucher } from "@prisma/client";
import { ActionResult } from "@/app/_types";

interface ParamsType {
  voucher: Voucher & { bucketId: string };
}

export const collectVoucher = async ({
  voucher,
}: ParamsType): Promise<ActionResult> => {
  try {
    const { isUserAuthenticated, dbUserId } = userAuthentication();

    if (!isUserAuthenticated || !dbUserId)
      return {
        success: false,
        message: "Unauthenticated.",
      };

    if (voucher.collectedBy.includes(dbUserId))
      return { success: false, message: "Voucher is already collected." };

    if (voucher.vouchersUsed === voucher.totalVouchers)
      return {
        success: false,
        message: "No vouchers remaining. All vouchers have been used.",
      };

    const bucketId = voucher.bucketId;

    //@ts-ignore
    delete voucher.bucketId;

    await prisma.$transaction([
      prisma.user.update({
        where: {
          id: dbUserId,
        },
        data: {
          collectedVouchers: {
            push: { voucher },
          },
        },
      }),
      prisma.$runCommandRaw({
        findAndModify: "PromoToolsBucket",
        query: {
          _id: { $oid: bucketId },
          vouchers: { $elemMatch: { id: voucher.id } },
        },
        update: {
          $inc: { "vouchers.$.vouchersUsed": 1 },
          $push: {
            "vouchers.$.collectedBy": dbUserId,
          },
        },
      }),
    ]);

    return {
      success: true,
      message: "Collected Voucher Succesfully.",
    };
  } catch (e) {
    console.log(e);
    return {
      success: false,
      message: "Something goes wrong.",
    };
  }
};
