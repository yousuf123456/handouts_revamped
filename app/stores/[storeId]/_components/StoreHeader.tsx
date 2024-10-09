import React from "react";

import Image from "next/image";

import { Calendar } from "lucide-react";
import { Store } from "@prisma/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Searchbar } from "./Searchbar";

interface StoreHeaderProps {
  storeInfo: Pick<Store, "id" | "name" | "logo" | "createdAt" | "description">;
}

export const StoreHeader = ({ storeInfo }: StoreHeaderProps) => {
  return (
    <section className="bg-gradient-to-b from-sky-50 to-white py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center gap-6 text-center">
          <Avatar className="h-16 w-16">
            <AvatarImage asChild src={storeInfo.logo || undefined}>
              <Image src={storeInfo.logo || ""} alt="User Profile" fill />
            </AvatarImage>
            <AvatarFallback>{storeInfo.name[0].toUpperCase()}</AvatarFallback>
          </Avatar>

          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-gray-800">
              {storeInfo.name}
            </h1>

            <p className="text-lg text-gray-600">
              {storeInfo.description ||
                "Here you meet the world full of innovations."}
            </p>

            <div className="flex items-center justify-center space-x-1 text-sm text-gray-500">
              <Calendar className="h-4 w-4" />
              <span>
                Store opened on{" "}
                {new Date(storeInfo.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          <Searchbar storeId={storeInfo.id} />
        </div>
      </div>
    </section>
  );
};
