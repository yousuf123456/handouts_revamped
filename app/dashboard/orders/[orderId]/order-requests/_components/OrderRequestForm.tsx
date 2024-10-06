"use client";

import React, { createContext, useEffect, useState } from "react";

import { Policy } from "./Policy";
import { FeedbackInput } from "./FeedbackInput";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { SelectRequestProducts } from "./SelectRequestProducts";
import { UserOrder } from "../../../_serverFunctions/getUserOrders";
import { cancelOrderedProducts } from "../_serverActions/cancelOrderedProducts";
import { toast } from "sonner";
import { ActionResult } from "@/app/_types";
import { returnOrderedProducts } from "../_serverActions/returnOrderedProducts";
import { absoluteUrl, routes } from "@/app/_config/routes";
import { ProofImages } from "./ProofImages";

interface OrderRequestFormProps {
  orderPackage: UserOrder["packages"][number];
}

export type RequestFormData = {
  selectedOrderedProducts: { id: string; reason: string }[];
  proofImages: File[];
  feedback: string;
};

export const requestFormContext = createContext<{
  requestFormData: RequestFormData;
  setRequestFormData: React.Dispatch<React.SetStateAction<RequestFormData>>;
}>({
  requestFormData: {} as any,
  setRequestFormData: {} as any,
});

export const OrderRequestForm = ({ orderPackage }: OrderRequestFormProps) => {
  const [isPerformingAction, setIsPerformingAction] = useState(false);

  const [requestFormData, setRequestFormData] = useState<RequestFormData>({
    selectedOrderedProducts: [],
    proofImages: [],
    feedback: "",
  });

  const router = useRouter();
  const searchParams = useSearchParams();

  const type = searchParams.get("type") as "cancel" | "return";

  const onSubmit = async () => {
    setIsPerformingAction(true);

    let promise: Promise<ActionResult>;

    if (type === "cancel") {
      promise = cancelOrderedProducts({
        orderPackage,
        requestFormData,
      });
    } else {
      let urls: string[] = [];

      if (requestFormData.proofImages.length > 0) {
        const formData = new FormData();
        requestFormData.proofImages.forEach((file) => {
          formData.append("images", file);
        });

        // Upload the images
        const uploadResponse = await fetch(absoluteUrl("/api/uploadImages"), {
          method: "POST",
          body: formData,
        });

        if (!uploadResponse.ok) {
          return toast.error("Something went wrong.");
        }

        const data = await uploadResponse.json();
        urls = data.urls;
      }

      promise = returnOrderedProducts({
        orderPackage,
        requestFormData: { ...requestFormData, proofImages: urls },
      });
    }

    toast.promise(promise, {
      loading:
        type === "cancel"
          ? "Cancelling your products"
          : "Returning your products",
      success(data) {
        if (data.success) return data.message;
        else throw new Error(data.message);
      },
      error(data) {
        return data.message;
      },
      finally() {
        setIsPerformingAction(false);
        router.push(routes.orderDetails(orderPackage.orderId));
      },
    });
  };

  return (
    <requestFormContext.Provider
      value={{ requestFormData, setRequestFormData }}
    >
      <div className="flex flex-col gap-6">
        <SelectRequestProducts orderedProducts={orderPackage.orderedProducts} />

        <FeedbackInput />

        {type === "return" && <ProofImages />}

        <Policy />

        <Button
          onClick={onSubmit}
          disabled={
            requestFormData.selectedOrderedProducts.length === 0 ||
            isPerformingAction
          }
        >
          Submit
        </Button>
      </div>
    </requestFormContext.Provider>
  );
};
