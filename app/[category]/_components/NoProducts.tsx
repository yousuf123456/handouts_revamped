"use client";

import React from "react";
import { Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export const NoProducts = () => {
  const router = useRouter();

  return (
    <div className="flex min-h-[50vh] items-center justify-center bg-transparent p-4">
      <div className="mx-auto w-full max-w-md text-center">
        <div className="mb-4 flex w-full justify-center">
          <Package className="h-8 w-8 md:h-10 md:w-10" strokeWidth={1} />
        </div>
        <h2 className="mb-4 text-3xl font-light uppercase sm:text-4xl">
          No Products
        </h2>
        <p className="mb-8 text-sm text-muted-foreground sm:text-base">
          Sorry, no products match your search. Please try adjusting your
          filters / query or check back later!
        </p>

        <Button
          size={"lg"}
          variant={"corners"}
          className="w-full uppercase"
          onClick={() => router.back()}
        >
          Go Back
        </Button>
      </div>
    </div>
  );
};
