"use client";
import React, { useState } from "react";

import { Star } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { OrderedProduct } from "@prisma/client";
import { ProductImage } from "@/app/_components/ProductImage";
import { createReview } from "../_serverActions/createReview";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { absoluteUrl, routes } from "@/app/_config/routes";
import { ReviewImages } from "./ReviewImages";
import { StarRating } from "./StarRating";
import { ReviewTextarea } from "./ReviewTextArea";

export const WriteReviewForm = ({
  orderedProduct,
}: {
  orderedProduct: OrderedProduct;
}) => {
  const [review, setReview] = useState("");
  const [rating, setRating] = useState<1 | 2 | 3 | 4 | 5>(5);
  const [reviewImagesFiles, setReviewImagesFiles] = useState<File[]>([]);

  const [isPerformingAction, setIsPerformingAction] = useState(false);

  const router = useRouter();

  const onSubmitReview = async () => {
    // setIsPerformingAction(true);

    const formData = new FormData();
    reviewImagesFiles.forEach((file) => {
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

    const { urls } = await uploadResponse.json();

    const promise = createReview({
      productId: orderedProduct.product.id,
      orderedProductId: orderedProduct.id,
      storeId: orderedProduct.storeId,
      reviewImages: urls,
      rating,
      review,
    });

    toast.promise(promise, {
      loading: "Publishing your review",
      success(data) {
        if (data.success) return data.message;
        else throw new Error(data.message);
      },
      error(data) {
        return data.message;
      },
      finally() {
        setIsPerformingAction(false);
        router.push(routes.publishedReviews);
      },
    });
  };

  const maxChars = 300;

  const handleStarClick = (selectedRating: 1 | 2 | 3 | 4 | 5) => {
    setRating(selectedRating);
  };

  const handleReviewChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= maxChars) setReview(e.target.value);
  };

  return (
    <div className="mx-auto mt-8 flex w-full max-w-screen-md flex-col gap-6">
      <div className="flex items-center gap-5 max-sm:flex-col">
        <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md sm:h-24 sm:w-24">
          <ProductImage
            fill
            alt={orderedProduct.product.name}
            src={orderedProduct.product.image}
          />
        </div>

        <h3 className="text-base font-medium uppercase">
          {orderedProduct.product.name}
        </h3>
      </div>

      <StarRating rating={rating} onStarClick={handleStarClick} />

      <ReviewTextarea
        review={review}
        maxChars={maxChars}
        handleReviewChange={handleReviewChange}
      />

      <ReviewImages
        reviewImagesFiles={reviewImagesFiles}
        setReviewImagesFiles={setReviewImagesFiles}
      />

      <Button
        onClick={onSubmitReview}
        disabled={isPerformingAction}
        className="w-full"
      >
        Submit Review
      </Button>
    </div>
  );
};
