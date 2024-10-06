import Image from "next/image";
import React, { ComponentProps } from "react";
import { cn } from "../_utils/cn";

// interface ProductImageProps {
//   src: string | null;
//   loading?: "lazy" | "eager";
// }

type ProductImageProps = Omit<ComponentProps<typeof Image>, "src" | "alt"> & {
  src: string | null | undefined;
  alt?: string;
};

export const ProductImage: React.FC<ProductImageProps> = ({
  alt,
  src,
  className,
  ...imageProps
}) => {
  return (
    <Image
      src={src || ""}
      alt={alt || "Product Image"}
      className={cn("object-cover", className)}
      {...imageProps}
    />
  );
};
