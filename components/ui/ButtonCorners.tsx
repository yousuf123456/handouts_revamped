import { cn } from "@/app/_utils/cn";
import React from "react";

interface ButtonCornersProps {
  className?: string;
}

export const ButtonCorners = ({ className }: ButtonCornersProps) => {
  return (
    <>
      <div
        className={cn(
          "absolute left-0 top-0 h-[1px] w-2 bg-zinc-500 group-hover:w-1/2",
          className,
        )}
      />
      <div
        className={cn(
          "absolute left-0 top-0 h-2 w-[1px] bg-zinc-500 group-hover:h-1/2",
          className,
        )}
      />
      <div
        className={cn(
          "absolute right-0 top-0 h-[1px] w-2 bg-zinc-500 group-hover:w-1/2",
          className,
        )}
      />
      <div
        className={cn(
          "absolute right-0 top-0 h-2 w-[1px] bg-zinc-500 group-hover:h-1/2",
          className,
        )}
      />

      <div
        className={cn(
          "absolute bottom-0 left-0 h-[1px] w-2 bg-zinc-500 group-hover:w-1/2",
          className,
        )}
      />
      <div
        className={cn(
          "absolute bottom-0 left-0 h-2 w-[1px] bg-zinc-500 group-hover:h-1/2",
          className,
        )}
      />
      <div
        className={cn(
          "absolute bottom-0 right-0 h-[1px] w-2 bg-zinc-500 group-hover:w-1/2",
          className,
        )}
      />
      <div
        className={cn(
          "absolute bottom-0 right-0 h-2 w-[1px] bg-zinc-500 group-hover:h-1/2",
          className,
        )}
      />
    </>
  );
};
