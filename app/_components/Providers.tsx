"use client";
import React from "react";

import { ClerkProvider } from "@clerk/nextjs";
import { NextUIProvider } from "@nextui-org/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
const client = new QueryClient();

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ClerkProvider>
      <QueryClientProvider client={client}>
        <NextUIProvider>
          <Toaster />
          {children}
        </NextUIProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
};
