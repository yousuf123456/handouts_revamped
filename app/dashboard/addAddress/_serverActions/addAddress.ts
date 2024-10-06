"use server";

import prisma from "@/app/_libs/prismadb";

import ObjectID from "bson-objectid";
import { Address } from "@prisma/client";
import { ActionResult } from "@/app/_types";
import { userAuthentication } from "@/app/_serverFunctions/userAuthentication";
import { userRecordCache } from "@/app/_config/cache";

interface addAddressParams {
  newAddress: Address;
  editExistingAddress: boolean;
  addressId: string | undefined;
}

export const addAddress = async ({
  newAddress,
  addressId,
  editExistingAddress,
}: addAddressParams): Promise<ActionResult> => {
  try {
    const { isUserAuthenticated, dbUserId } = userAuthentication();

    if (!isUserAuthenticated || !dbUserId)
      return { success: false, message: "Unauthenticated." };

    const userAddressDiary = (
      await prisma.user.findUnique({
        where: { id: dbUserId },
        select: { addressDiary: true },
      })
    )?.addressDiary;

    if (!userAddressDiary)
      return {
        success: false,
        message: "User record does not exist in database.",
      };

    let newAddressDiary = userAddressDiary;

    // Check if the address has default billing or shipping set to true
    const hasDefaultBilling = newAddress.isDefaultBillingAddress;
    const hasDefaultShipping = newAddress.isDefaultShippingAddress;

    // If either is true, set them to false for all other addresses
    if (hasDefaultBilling || hasDefaultShipping) {
      newAddressDiary = newAddressDiary.map((addr) => {
        return {
          ...addr,
          isDefaultBillingAddress: hasDefaultBilling
            ? false
            : addr.isDefaultBillingAddress,
          isDefaultShippingAddress: hasDefaultShipping
            ? false
            : addr.isDefaultShippingAddress,
        };
      });
    }

    // Check if it is the only address that will be existing in addressDiary, if yes than make it default for billing and shipping
    if (
      newAddressDiary.length === 0 ||
      (editExistingAddress && newAddressDiary.length === 1)
    ) {
      newAddress.isDefaultBillingAddress = true;
      newAddress.isDefaultShippingAddress = true;
    }

    // Assign a unique id to a new address
    if (!editExistingAddress) newAddress.id = ObjectID().toHexString();

    if (editExistingAddress) {
      newAddressDiary = newAddressDiary.map((addr) =>
        addr.id === addressId ? newAddress : addr,
      );
    } else newAddressDiary.unshift(newAddress);

    await prisma.user.update({
      where: { id: dbUserId },
      data: { addressDiary: newAddressDiary },
    });

    userRecordCache.revalidate(dbUserId); // Revalidating user record cache to ensure the latest user db object is returned

    return {
      success: true,
      message: editExistingAddress
        ? "Edited the address succesfully."
        : "Added a new address to your address diary succesfully.",
    };
  } catch (e) {
    console.log("Error in adding address: ", e);
    return { success: false, message: "Something went wrong." };
  }
};
