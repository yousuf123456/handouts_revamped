import React from "react";

export const HeadingWrapper = ({
  children,
  heading,
}: {
  children: React.ReactNode;
  heading: string;
}) => {
  return (
    <div className="mx-auto flex w-full max-w-screen-xl flex-col gap-5 overflow-y-auto px-3 py-6 scrollbar-thin sm:gap-8">
      <h1 className="w-full text-center text-lg font-medium uppercase sm:text-xl">
        {heading}
      </h1>
      {children}
    </div>
  );
};
