import React, { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type IconWrapperProps = HTMLAttributes<HTMLDivElement> & {
  label?: string;
};

export const IconWrapper = ({
  className,
  children,
  label,
  ...divProps
}: IconWrapperProps) => {
  return (
    <div
      {...divProps}
      className={cn(
        "peer relative cursor-pointer rounded-full border-[1px] border-black border-opacity-10 bg-white p-2.5 transition-colors hover:bg-slate-50",
        className,
      )}
    >
      {children}
      {label && (
        <p className="font-roboto absolute -bottom-7 left-1/2 w-max -translate-x-1/2 text-sm text-black opacity-0 group-hover:opacity-95 peer-hover:opacity-100">
          {label}
        </p>
      )}
    </div>
  );
};
