import { getPriceInfo } from "@/app/_utils/getPriceInfo";
import { GroupedCheckoutProducts } from "../_components/CheckoutSummary";

export const getGroupedCheckoutProductsTotal = (
  groupedCheckoutProductsValues: GroupedCheckoutProducts[string][],
): { productsTotal: number; delieveryTotal: number; totalQuantity: number } => {
  // Total number of products being ordered
  let totalQuantity = 0;

  // Calculate the total delievery fee for all the stores
  const delieveryTotal = groupedCheckoutProductsValues
    .map((groupedCheckoutProduct) => {
      if (groupedCheckoutProduct.isFreeDelievery) return 0;

      return groupedCheckoutProduct.delieveryFee || 0;
    })
    .reduce((acc, delieveryFee) => acc + delieveryFee, 0);

  // Calculate the total of all the products from all stores
  const productsTotal = groupedCheckoutProductsValues
    .flatMap((groupedCheckoutProduct) =>
      groupedCheckoutProduct.checkoutProducts.map((checkoutProduct) => {
        totalQuantity += checkoutProduct.quantity;

        return (
          getPriceInfo(
            checkoutProduct.product,
            checkoutProduct.selectedCombinationId,
          ).currentPrice * checkoutProduct.quantity
        );
      }),
    )
    .reduce((acc, productTotal) => acc + productTotal, 0);

  return { productsTotal, delieveryTotal, totalQuantity };
};
