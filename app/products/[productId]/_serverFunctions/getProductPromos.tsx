import prisma from "@/app/_libs/prismadb";
import { FreeShipping, Voucher } from "@prisma/client";

interface ProductPromoParams {
  productId: string;
  storeId: string;
}

interface PromoToolsBucket {
  id: string;
  vouchers: Voucher[];
  freeShipping: FreeShipping[];
}

export const getProductPromos = async ({
  productId,
  storeId,
}: ProductPromoParams) => {
  const promoToolsBucket = await prisma.promoToolsBucket.findMany({
    where: { storeId },
    select: { id: true, freeShipping: true, vouchers: true },
  });

  const vouchers = extractVouchers(promoToolsBucket, productId);
  const freeShippings = extractFreeShippings(promoToolsBucket, productId);

  return { vouchers, freeShippings };
};

const extractVouchers = (
  promoToolsBuckets: PromoToolsBucket[],
  productId: string,
) => {
  const flattenedVouchers = promoToolsBuckets.flatMap((promoToolsBucket) =>
    promoToolsBucket.vouchers.map((voucher) => ({
      ...voucher,
      bucketId: promoToolsBucket.id,
    })),
  );

  const availableVouchers = flattenedVouchers.filter((v) => {
    if (
      (v.applicableOn === "EntireStore" || v.productIds.includes(productId)) &&
      v.vouchersUsed !== v.totalVouchers
    )
      return true;

    return false;
  });

  return availableVouchers;
};

const extractFreeShippings = (
  promoToolsBuckets: PromoToolsBucket[],
  productId: string,
) => {
  const flattenedFreeShippings = promoToolsBuckets.flatMap((promoToolsBucket) =>
    promoToolsBucket.freeShipping.map((freeShipping) => freeShipping),
  );

  const availableFreeShippings = flattenedFreeShippings.filter((f) => {
    if (f.applicableOn === "EntireStore" || f.productIds.includes(productId))
      return true;

    return false;
  });

  return availableFreeShippings;
};
