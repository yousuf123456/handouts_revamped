"use server";
import prisma from "@/app/_libs/prismadb";

import { userAuthentication } from "@/app/_serverFunctions/userAuthentication";
import { userRecordCache } from "@/app/_config/cache";

export const deleteAddress = async (addressId: string) => {
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

    const addressToDelete = userAddressDiary.filter(
      (addr) => addr.id === addressId,
    )[0];

    let newAddressDiary = userAddressDiary.filter(
      (addr) => addr.id !== addressId,
    );

    const hadDefaultShipping = addressToDelete.isDefaultShippingAddress;
    const hadDefaultBilling = addressToDelete.isDefaultBillingAddress;

    // If the addressToRemove was default billing address than now make the first address default
    if (hadDefaultBilling && newAddressDiary.length > 0) {
      newAddressDiary[0].isDefaultBillingAddress = true;
    }

    // If the addressToRemove was default shipping address than now make the first address default
    if (hadDefaultShipping && newAddressDiary.length > 0) {
      newAddressDiary[0].isDefaultShippingAddress = true;
    }

    await prisma.user.update({
      where: { id: dbUserId },
      data: { addressDiary: newAddressDiary },
    });

    userRecordCache.revalidate(dbUserId); // Revalidating user record cache to ensure the latest user db object is returned

    return {
      success: true,
      message: "Deleted the address succesfully.",
    };
  } catch (e) {
    console.log("Error in adding address: ", e);
    return { success: false, message: "Something went wrong." };
  }
};
