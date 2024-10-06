import Link from "next/link";
import { format } from "date-fns";
import { OrderedProduct } from "@prisma/client";
import { CalendarDays, Star } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { ProductImage } from "@/app/_components/ProductImage";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

import { routes } from "../../../_config/routes";

interface WriteReviewCTA {
  orderedProduct: Pick<
    OrderedProduct,
    "id" | "product" | "createdAt" | "delieveredAt"
  >;
}

export default function WriteReviewCTA({ orderedProduct }: WriteReviewCTA) {
  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="flex items-center space-x-4">
          <Link href={routes.productDetails(orderedProduct.product.id)}>
            <div className="relative h-20 w-20 overflow-hidden rounded-md sm:h-24 sm:w-24">
              <ProductImage
                fill
                alt={orderedProduct.product.name}
                src={orderedProduct.product.image}
              />
            </div>
          </Link>

          <div className="flex-1">
            <Link href={routes.productDetails(orderedProduct.product.id)}>
              <h3 className="text-sm font-medium uppercase sm:text-base">
                {orderedProduct.product.name}
              </h3>
            </Link>

            <div className="mt-2 space-y-1 text-sm text-muted-foreground">
              <div className="flex items-center">
                <CalendarDays className="mr-2 h-4 w-4" />
                <span>
                  Ordered:{" "}
                  {format(new Date(orderedProduct.createdAt), "MMM dd, yyyy")}
                </span>
              </div>
              {orderedProduct.delieveredAt && (
                <div className="flex items-center">
                  <CalendarDays className="mr-2 h-4 w-4" />
                  <span>
                    Delivered:{" "}
                    {format(
                      new Date(orderedProduct.delieveredAt),
                      "MMM dd, yyyy",
                    )}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-muted/50 p-6">
        <Link
          href={`${routes.writeReview}?orderedProductId=${orderedProduct.id}`}
          className={buttonVariants({ className: "w-full" })}
        >
          <Star className="mr-2 h-4 w-4" />
          Write a Review
        </Link>
      </CardFooter>
    </Card>
  );
}
