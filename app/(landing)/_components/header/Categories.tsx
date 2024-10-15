import { routes } from "@/app/_config/routes";
import { cn } from "@/app/_utils/cn";
import { Button } from "@/components/ui/button";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { Category } from "@prisma/client";
import { useRouter } from "next/navigation";
import { ArrowLeft, ChevronRight } from "lucide-react";
import React, { useState } from "react";

interface CategoriesProps {
  catsOpen: boolean;
  categories: Category[];
  setCatsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Categories = ({
  catsOpen,
  categories,
  setCatsOpen,
}: CategoriesProps) => {
  const [selectedCat, setSelectedCat] = useState<Category | null>(null);

  const onBack = () => {
    if (!selectedCat?.parentId) return setSelectedCat(null);

    const category = categories.find((cat) => cat.id === selectedCat.parentId);
    if (category) setSelectedCat(category);
  };

  const router = useRouter();

  return (
    <Sheet open={catsOpen} onOpenChange={setCatsOpen}>
      <SheetContent side={"left"} className="w-full px-3 max-sm:max-w-[85%]">
        <SheetHeader className="mb-8">
          <Button
            size={"icon"}
            onClick={onBack}
            variant={"secondary"}
            disabled={!selectedCat}
          >
            <ArrowLeft strokeWidth={1.3} className={cn("h-5 w-5")} />
          </Button>

          <SheetTitle className="text-center font-normal uppercase text-black">
            {selectedCat ? selectedCat.name : "Categories"}
          </SheetTitle>
        </SheetHeader>

        {categories
          .filter((cat) => {
            if (selectedCat && cat.parentId === selectedCat.id) return true;
            if (!selectedCat && cat.parentId === null) return true;
          })
          .map((cat) => (
            <div
              onClick={() => {
                if (categories.find((category) => category.parentId === cat.id))
                  return setSelectedCat(cat);

                router.push(`/${cat.name}`);
              }}
              className="flex w-full cursor-pointer items-center justify-between gap-4 border-t border-black/30 px-2 py-3 transition-colors hover:bg-gray-100"
            >
              <p className="line-clamp-1 text-ellipsis text-sm uppercase text-black/90">
                {cat.name}
              </p>

              {categories.find((category) => category.parentId === cat.id) && (
                <ChevronRight
                  strokeWidth="1"
                  className="h-6 w-6 text-black/70"
                />
              )}
            </div>
          ))}
      </SheetContent>
    </Sheet>
  );
};
