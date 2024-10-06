import React from "react";
import { cn } from "../_utils/cn";

interface ProductsListLayoutProps {
  children: React.ReactNode;
  customLayout?: string;
  className?: string;
}

export const ProductsListLayout: React.FC<ProductsListLayoutProps> = ({
  children,
  className,
  customLayout,
}) => {
  return (
    <div
      className={cn(
        customLayout ||
          "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5",
        "gap-x-2 gap-y-8 sm:gap-x-3 sm:gap-y-12",
        className,
      )}
    >
      {children}
    </div>
  );
};
