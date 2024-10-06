import { Product, ProductCombination, Voucher } from "@prisma/client";
import { getVoucherDiscountedPrice } from "../checkout/_utils/applyVouchers";

type RequiredProductFields = Pick<
  Product,
  | "price"
  | "promoPrice"
  | "combinations"
  | "promoPriceEndingDate"
  | "promoPriceStartingDate"
> & { appliedVoucher?: Voucher; [key: string]: any };

export const getPriceInfo = (
  product: RequiredProductFields,
  selectedCombinationId?: string | null,
) => {
  // Get the selected combination
  const selectedCombination = product.combinations?.filter(
    (proCombination) => proCombination.id === selectedCombinationId,
  )[0] as ProductCombination | undefined;

  // Get the base values to do calculations upon
  const basePrice = selectedCombination
    ? selectedCombination.price
    : product.price;
  const basePromoPrice = selectedCombination
    ? selectedCombination.promoPrice
    : product.promoPrice;
  const basePromoPriceEndingDate = selectedCombination
    ? selectedCombination.promoPriceEndingDate
    : product.promoPriceEndingDate;
  const basePromoPriceStartingDate = selectedCombination
    ? selectedCombination.promoPriceStartingDate
    : product.promoPriceStartingDate;

  // Check if there is a promo price
  const onDiscount =
    !!basePromoPrice &&
    !isPromoPriceExpired(basePromoPriceStartingDate, basePromoPriceEndingDate);

  // Get the current price
  const getCurrentPrice = () => {
    if (
      !basePromoPrice ||
      !basePromoPriceEndingDate ||
      !basePromoPriceStartingDate
    )
      return basePrice;

    if (
      isPromoPriceExpired(basePromoPriceStartingDate, basePromoPriceEndingDate)
    )
      return basePrice;

    return basePromoPrice;
  };

  // Calculate the price off
  const priceOff = basePrice - (basePromoPrice || 0);

  // Create a label for price off
  const priceOffLabel = priceOff + " Rs OFF";

  let currentPrice = getCurrentPrice();

  if (product.appliedVoucher) {
    currentPrice = getVoucherDiscountedPrice({
      voucher: product.appliedVoucher,
      currentPrice,
    });
  }

  return {
    discountOffLabel: priceOffLabel,
    productOnSale: onDiscount,
    originalPrice: basePrice,
    discountOff: priceOff,
    currentPrice,
  };
};

// Check to see if promo price has expired
const isPromoPriceExpired = (
  startingDate: Date | null,
  endingDate: Date | null,
) => {
  if (!startingDate || !endingDate) return true;

  const currentDate = new Date();

  if (currentDate < startingDate || currentDate > endingDate) return true;

  return false;
};
