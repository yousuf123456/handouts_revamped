"use client";
import React, { useState } from "react";

import Link from "next/link";

import { cn } from "../_utils/cn";
import clsx from "clsx";
import axios from "axios";

import { getPriceInfo } from "../_utils/getPriceInfo";
import { ProductImage } from "./ProductImage";

import { HiStar } from "react-icons/hi";
import { Product } from "@prisma/client";
import { AnimatePresence, motion } from "framer-motion";

export interface ProductCardProps {
  product: Pick<
    Product,
    | "id"
    | "name"
    | "image"
    | "price"
    | "avgRating"
    | "attributes"
    | "detailedImages"
    | "categoryTreeData"
    | "superTokensUserId"
  > & { [key: string]: any };
  showDiscountLabel?: boolean;
  dynamic?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  dynamic,
}) => {
  const [currentImage, setCurrentImage] = useState(product.image);
  const { productOnSale, currentPrice } = getPriceInfo(product as any);

  const onClick = () => {
    const productData = {
      categoryTreeData: product.categoryTreeData,
      attributes: product.attributes,
      name: product.name,
      id: product.id,
    };

    // axios.post("../../../api/browsingHistoryAdd", {
    //   productData: productData,
    //   product.id: product.id,
    // });

    // axios.post("../api/productClick", {
    //   product.id: product.id,
    //   //@ts-ignore
    //   storeId: product.storeId,
    //   superTokensUserId: product.superTokensUserId,
    // });
  };

  const slideVariants = {
    initial: { opacity: 0.6 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.1,
        ease: "linear",
      },
    },
    exit: {
      opacity: 0.6,
      transition: {
        duration: 0.1,
        ease: "linear",
      },
    },
  };

  return (
    <div onClick={onClick} className="relative">
      <div
        onMouseOver={() =>
          setCurrentImage(product.detailedImages[1] ?? product.image)
        }
        onMouseLeave={() => setCurrentImage(product.image)}
        className={cn(
          "group relative flex flex-col gap-2 overflow-hidden bg-transparent pb-2",
          dynamic ? "w-full" : "w-[180px] sm:w-52 lg:w-64",
        )}
      >
        <Link href={`/products/${product.id}`}>
          <div
            className={clsx(
              "relative overflow-hidden",
              dynamic ? " aspect-1 h-auto w-auto" : "h-[180px] sm:h-52 lg:h-64",
            )}
          >
            <AnimatePresence mode="wait">
              <motion.div
                className="relative h-full w-full"
                key={currentImage}
                variants={slideVariants}
                initial={"initial"}
                animate="visible"
                exit={"exit"}
              >
                <ProductImage src={currentImage} fill />
              </motion.div>
            </AnimatePresence>
          </div>
        </Link>

        <div className="flex flex-col gap-0">
          <Link href={`/products/${product.id}`}>
            <p className="font-prim line-clamp-2 w-full overflow-hidden text-sm text-zinc-800 md:text-base">
              {product?.name}
            </p>

            <div className="mt-3 flex justify-between">
              <div className="flex flex-col gap-0">
                <p className="font-prim text-xl font-medium leading-5 text-black md:text-2xl">
                  Rs.{currentPrice}
                </p>
                {productOnSale && (
                  <p className="font-prim text-sm font-light text-zinc-600 line-through md:text-base">
                    Rs.{product.price}
                  </p>
                )}
              </div>

              <div className="flex h-fit items-center gap-1 rounded-3xl border border-zinc-200 px-2 py-0.5 md:mr-3 md:gap-3">
                <HiStar className="h-4 w-4 text-slate-800" />
                <p className="font-prim text-sm text-zinc-800">
                  {product.avgRating}
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};
