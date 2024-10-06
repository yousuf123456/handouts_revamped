import React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductImage } from "@/app/_components/ProductImage";

export const ReturnRequestImages = ({
  proofImages,
}: {
  proofImages: string[];
}) => {
  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-xl">Return Request Images</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-5">
          {proofImages.map((image, index) => (
            <div
              key={index}
              className="relative h-20 w-20 overflow-hidden rounded"
            >
              <ProductImage src={image} fill />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
