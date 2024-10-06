import React from "react";
import {
  CheckoutProduct,
  getCheckoutData,
} from "../_serverFunctions/getCheckoutData";
import { applyFreeShipping } from "../_utils/applyFreeShipping";
import { applyVouchers } from "../_utils/applyVouchers";
import { CheckoutTotal } from "./CheckoutTotal";
import { CheckoutProductsGroup } from "./CheckoutProductsGroup";
import { CheckoutDetails } from "./CheckoutDetails";
import getDBUser from "@/app/_serverActions/getDBUser";

export interface GroupedCheckoutProducts {
  [storeId: string]: {
    storeName: string;
    delieveryFee?: number;
    isFreeDelievery?: boolean;
    checkoutProducts: CheckoutProduct[];
  };
}

interface CheckoutSummaryProps {
  fromCart: boolean;
  quantity?: number;
  productId?: string;
  selectedCombinationId?: string;
}

const groupProductsByStore = (
  checkoutProducts: CheckoutProduct[],
): GroupedCheckoutProducts => {
  return checkoutProducts.reduce((acc, product) => {
    const { storeId, storeName } = product.product;

    if (!acc[storeId]) {
      acc[storeId] = { storeName, checkoutProducts: [], delieveryFee: 100 }; // Assume 100 delivery fee per store
    }

    acc[storeId].checkoutProducts.push(product);

    return acc;
  }, {} as GroupedCheckoutProducts);
};

export const CheckoutSummary = async ({
  fromCart,
  quantity,
  productId,
  selectedCombinationId,
}: CheckoutSummaryProps) => {
  const { user } = await getDBUser();

  if (!user) return <p>Unauthenticated</p>;

  const checkoutData = await getCheckoutData({
    fromCart,
    quantity,
    productId,
    selectedCombinationId,
  });

  if (!checkoutData.checkoutProducts) return;

  let groupedCheckoutProducts = groupProductsByStore(
    checkoutData.checkoutProducts,
  );

  groupedCheckoutProducts = applyFreeShipping({
    groupedCheckoutProducts,
    freeShippings: checkoutData.freeShippings,
  });

  groupedCheckoutProducts = applyVouchers({
    groupedCheckoutProducts,
    collectedVouchers: checkoutData.collectedVouchers,
  });

  return (
    <div className="flex flex-col gap-8 lg:flex-row">
      <div className="bg-white lg:w-2/3">
        <div className="flex flex-col gap-6">
          {Object.values(groupedCheckoutProducts).map(
            (groupedCheckoutProduct, i) => (
              <CheckoutProductsGroup
                key={i}
                groupedCheckoutProduct={groupedCheckoutProduct}
              />
            ),
          )}
        </div>
      </div>

      <CheckoutDetails
        groupedCheckoutProducts={groupedCheckoutProducts}
        addressDiary={user.addressDiary}
      />
    </div>
  );
};
