import React from "react";

import { LucideIcon } from "lucide-react";

interface EmptyState {
  heading: string;
  Icon: LucideIcon;
  actionLabel?: string;
  children?: React.ReactNode;
}

export const EmptyState = ({
  Icon,
  heading,
  actionLabel,
  children,
}: EmptyState) => {
  return (
    <div className="flex min-h-[50vh] items-center justify-center bg-background p-4">
      <div className="mx-auto w-full max-w-lg text-center">
        <div className="mb-4 flex w-full justify-center">
          <Icon className="h-8 w-8 md:h-10 md:w-10" strokeWidth={1} />
        </div>

        <h2 className="mb-4 text-3xl font-light uppercase sm:text-4xl">
          {heading}
        </h2>

        {actionLabel && (
          <p className="mb-8 text-sm text-muted-foreground sm:text-base">
            {actionLabel}
          </p>
        )}

        {children}
      </div>
    </div>
  );
};
