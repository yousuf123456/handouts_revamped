import { PromoToolsBucket } from "@prisma/client";
import { GroupedCheckoutProducts } from "../_components/CheckoutSummary";
import { getPriceInfo } from "@/app/_utils/getPriceInfo";

interface applyFreeShippingParams {
  groupedCheckoutProducts: GroupedCheckoutProducts;
  freeShippings:
    | Pick<PromoToolsBucket, "id" | "storeId" | "freeShipping">[]
    | null;
}

export const applyFreeShipping = ({
  groupedCheckoutProducts,
  freeShippings,
}: applyFreeShippingParams): GroupedCheckoutProducts => {
  if (!freeShippings) {
    Object.keys(groupedCheckoutProducts).forEach(
      (storeId) => (groupedCheckoutProducts[storeId].isFreeDelievery = false),
    );

    return groupedCheckoutProducts;
  }

  Object.keys(groupedCheckoutProducts).forEach((storeId) => {
    const storeFreeShippings = freeShippings
      .filter((freeShipping) => freeShipping.storeId === storeId)
      .flatMap((freeShipping) => freeShipping.freeShipping);

    // Calculate total of all the products of this store group
    const productsTotal = groupedCheckoutProducts[storeId].checkoutProducts
      .map(
        (p) =>
          getPriceInfo(p.product, p.selectedCombinationId).currentPrice *
          p.quantity,
      )
      .reduce((accumulator, pPrice) => accumulator + pPrice, 0);

    // Check to see if there is any freeshipping which is for the entire store and satisfies the condition
    const hasStoreWideFreeShipping = storeFreeShippings.some((freeShipping) => {
      if (freeShipping.applicableOn === "EntireStore") {
        if (
          freeShipping.condition === "MinOrderValue" &&
          freeShipping.minOrderValue > productsTotal
        )
          return false;

        return true;
      }

      return false;
    });

    // Check to see if all the products have freeshipping promo associated with them and they also fullfils the condition
    const isFreeShippingOnAllProducts = groupedCheckoutProducts[
      storeId
    ].checkoutProducts.every((checkoutProduct) =>
      storeFreeShippings.some((freeShipping) => {
        if (freeShipping.productIds.includes(checkoutProduct.product.id)) {
          const productTotal =
            getPriceInfo(
              checkoutProduct.product,
              checkoutProduct.selectedCombinationId,
            ).currentPrice * checkoutProduct.quantity;

          if (
            freeShipping.condition === "MinOrderValue" &&
            freeShipping.minOrderValue > productTotal
          )
            return false;

          return true;
        }

        return false;
      }),
    );

    if (hasStoreWideFreeShipping || isFreeShippingOnAllProducts)
      groupedCheckoutProducts[storeId].isFreeDelievery = true;
    else groupedCheckoutProducts[storeId].isFreeDelievery = false;
  });

  return groupedCheckoutProducts;
};
