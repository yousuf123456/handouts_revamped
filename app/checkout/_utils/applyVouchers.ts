import { Voucher } from "@prisma/client";
import { GroupedCheckoutProducts } from "../_components/CheckoutSummary";
import { getPriceInfo } from "@/app/_utils/getPriceInfo";

interface applyVoucherParams {
  groupedCheckoutProducts: GroupedCheckoutProducts;
  collectedVouchers: Voucher[] | null;
}

export const applyVouchers = ({
  groupedCheckoutProducts,
  collectedVouchers,
}: applyVoucherParams): GroupedCheckoutProducts => {
  if (!collectedVouchers) return groupedCheckoutProducts;

  Object.keys(groupedCheckoutProducts).forEach((storeId) => {
    const storeVouchers = collectedVouchers.filter(
      (colVoucher) => colVoucher.storeId === storeId,
    );

    groupedCheckoutProducts[storeId].checkoutProducts.forEach(
      (checkoutProduct, i) => {
        // Calculate the product total
        const productTotal =
          getPriceInfo(
            checkoutProduct.product,
            checkoutProduct.selectedCombinationId,
          ).currentPrice * checkoutProduct.quantity;

        // Get all the vouchers that are applicable on this product
        const applicableVouchers = storeVouchers.filter((voucher) => {
          if (
            voucher.applicableOn === "EntireStore" ||
            voucher.productIds.includes(checkoutProduct.product.id)
          ) {
            if (voucher.minOrderValue > productTotal) return false;

            return true;
          }

          return false;
        });

        // See if there is any applicable vouchers
        if (applicableVouchers.length === 0) return;

        // Get the voucher which will give the biggest discount for this product total
        const bestApplicableVoucher = applicableVouchers.reduce(
          (bestVoucher, currentVoucher) => {
            const currentVoucherDiscountedPrice = getVoucherDiscountedPrice({
              voucher: currentVoucher,
              currentPrice: productTotal,
            });

            const bestVoucherDiscountedPrice = getVoucherDiscountedPrice({
              voucher: bestVoucher,
              currentPrice: productTotal,
            });

            return currentVoucherDiscountedPrice > bestVoucherDiscountedPrice
              ? currentVoucher
              : bestVoucher;
          },
        );

        groupedCheckoutProducts[storeId].checkoutProducts[
          i
        ].product.appliedVoucher = bestApplicableVoucher;
      },
    );
  });

  return groupedCheckoutProducts;
};

export function getVoucherDiscountedPrice({
  voucher,
  currentPrice,
}: {
  voucher: Voucher;
  currentPrice: number;
}) {
  if (voucher.discountType === "MoneyValue") {
    return currentPrice - voucher.discountOffValue;
  }

  if (voucher.discountType === "PercentageValue") {
    let discountAmount = (voucher.discountOffValue / 100) * currentPrice;

    if (voucher.maxDiscountValue && discountAmount > voucher.maxDiscountValue)
      discountAmount = voucher.maxDiscountValue;

    return currentPrice - discountAmount;
  }

  return currentPrice;
}
