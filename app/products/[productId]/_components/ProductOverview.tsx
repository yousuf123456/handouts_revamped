import React, { Suspense } from "react";

import {
  ProductAttributes,
  AtlasSearchPaginationSearchParams,
} from "@/app/_types";

import { ProductMeta } from "./ProductMeta";
import { RevamedProductImages } from "./ProductImages";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { ProductReviewsList } from "./ProductReviewsList";

import {
  PRODUCTS_REVIEWS_PER_PAGE,
  PRODUCTS_QUESTIONS_PER_PAGE,
} from "@/app/_config/pagination";

import Link from "next/link";
import { routes } from "@/app/_config/routes";
import { Button } from "@/components/ui/button";
import AskQuestionForm from "./AskQuestionForm";

import {
  FreeShipping,
  QuestionProductInformation,
  Voucher,
} from "@prisma/client";

import { ProductQuestionsList } from "./ProductQuestionsList";
import { ProductDetails } from "../_serverFunctions/getProductDetails";
import { MatchingProductsList } from "@/app/_components/MatchingProductsList";
import { QuestionReviewCardSkeleton } from "./loadings/QuestionReviewCardSkeleton";
import { ProductsListLayout } from "@/app/_components/ProductsListLayout";
import { ProductCardSkeleton } from "@/app/_components/ProductCardSkeleton";

type ProductInformationProps = {
  freeShippings: FreeShipping[];
  product: NonNullable<ProductDetails>;
  vouchers: (Voucher & { bucketId: string })[];
  searchParams: AtlasSearchPaginationSearchParams;
};

export const ProductOverview: React.FC<ProductInformationProps> = async ({
  product,
  vouchers,
  searchParams,
  freeShippings,
}) => {
  // Make it real
  const fakeDetailedImages = [
    "/images/exclusiveSection/frames.jpg",
    "/images/exclusiveSection/cosmicPlayland.jpg",
    "/images/exclusiveSection/handmade.jpg",
    "/images/exclusiveSection/luxury_decor.jpg",
  ];

  return (
    <div className="flex flex-col gap-16">
      <div className="grid grid-cols-1 gap-14 min-[960px]:grid-cols-9 min-[960px]:gap-8">
        <RevamedProductImages
          mainImage={product?.image}
          images={[
            ...product.detailedImages,
            ...fakeDetailedImages,
            product.image!,
          ]}
        />

        <div className="flex flex-col gap-12 max-[960px]:px-3 min-[960px]:col-span-4">
          <ProductMeta
            product={product}
            availableVouchers={vouchers}
            availableFreeShippings={freeShippings}
          />

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="reviews">
              <AccordionTrigger>
                <p className="font-prim text-base font-semibold uppercase text-black/80 sm:text-lg">
                  Reviews
                </p>
              </AccordionTrigger>

              <AccordionContent>
                <Suspense
                  fallback={
                    <div className="flex flex-col gap-5">
                      <QuestionReviewCardSkeleton />
                      <QuestionReviewCardSkeleton />{" "}
                      <QuestionReviewCardSkeleton />
                    </div>
                  }
                >
                  <Reviews
                    productId={product.id}
                    storeId={product.storeId}
                    ratingAndReviewsCount={product.ratingsCount}
                  />
                </Suspense>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="questions" className="border-t-0">
              <AccordionTrigger>
                <p className="font-prim text-base font-semibold uppercase text-black/80 sm:text-lg">
                  Questions
                </p>
              </AccordionTrigger>

              <AccordionContent>
                <Suspense
                  fallback={
                    <div className="flex flex-col gap-5">
                      <QuestionReviewCardSkeleton />
                      <QuestionReviewCardSkeleton />{" "}
                      <QuestionReviewCardSkeleton />
                    </div>
                  }
                >
                  <Questions
                    productId={product.id}
                    storeId={product.storeId}
                    questionsCount={product.questionsCount}
                    productInformation={{
                      image: product.image,
                      name: product.name,
                    }}
                  />
                </Suspense>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>

      <div className="w-full max-[960px]:px-2">
        <div id="matchingProductsContainer" className="flex flex-col gap-8">
          <h3 className="text-center text-xl font-medium uppercase text-black sm:text-2xl">
            You May Also Like
          </h3>

          <Suspense
            key={searchParams.paginationToken}
            fallback={
              <ProductsListLayout>
                <ProductCardSkeleton dynamic />
                <ProductCardSkeleton dynamic />
                <ProductCardSkeleton dynamic />
                <ProductCardSkeleton dynamic />
                <ProductCardSkeleton dynamic />
              </ProductsListLayout>
            }
          >
            <MatchingProductsList
              paginationToken={searchParams.paginationToken}
              pageDirection={searchParams.pageDirection as "next" | "prev"}
              productsToMatch={[
                {
                  id: product.id,
                  name: product.name,
                  categoryTreeData: product.categoryTreeData,
                  attributes: product.attributes as ProductAttributes,
                },
              ]}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

function Reviews({
  ratingAndReviewsCount,
  productId,
  storeId,
}: {
  ratingAndReviewsCount: number;
  productId: string;
  storeId: string;
}) {
  return (
    <div className="flex flex-col gap-5">
      <ProductReviewsList
        listOnePageOnly
        storeId={storeId}
        productId={productId}
      />

      {ratingAndReviewsCount > PRODUCTS_REVIEWS_PER_PAGE && (
        <div className="flex justify-center">
          <Link href={`${routes.productReviews(productId)}`}>
            <Button variant={"corners"} className="text-sm uppercase">
              View {ratingAndReviewsCount - PRODUCTS_REVIEWS_PER_PAGE}+ Reviews
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}

function Questions({
  productInformation,
  questionsCount,
  productId,
  storeId,
}: {
  productInformation: QuestionProductInformation;
  questionsCount: number;
  productId: string;
  storeId: string;
}) {
  return (
    <div className="flex flex-col gap-5">
      <AskQuestionForm
        storeId={storeId}
        productId={productId}
        productInformation={productInformation}
      />

      <ProductQuestionsList
        listOnePageOnly
        storeId={storeId}
        productId={productId}
      />

      {questionsCount > PRODUCTS_QUESTIONS_PER_PAGE && (
        <div className="flex justify-center">
          <Link href={`${routes.productQuestions(productId)}`}>
            <Button variant={"corners"} className="text-sm uppercase">
              View {questionsCount - PRODUCTS_QUESTIONS_PER_PAGE}+ Questions
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
