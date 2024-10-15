"use client";
import React, { useEffect, useState } from "react";

import Link from "next/link";
import Image from "next/image";

import { cn } from "@/app/_utils/cn";
import { Heart, LayoutGrid } from "lucide-react";
import { Searchbar } from "./Searchbar";
import { IconWrapper } from "./IconWrapper";
import { UserAccount } from "./UserAccount";
import { routes } from "@/app/_config/routes";
import { usePathname } from "next/navigation";
import { RiShoppingCartLine } from "react-icons/ri";
import { Category } from "@prisma/client";
import { Categories } from "./Categories";

export const HeaderContent = ({ categories }: { categories: Category[] }) => {
  const [catsOpen, setCatsOpen] = useState(false);

  const pathname = usePathname();
  const [imageTheme, setImageTheme] = useState(pathname === "/");

  useEffect(() => {
    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      const isAnyEntryIntersecting =
        entries.filter((entry) => entry.isIntersecting).length > 0;

      if (isAnyEntryIntersecting) setImageTheme(true);
      else {
        setImageTheme(false);
      }
    };

    const observerOptions = {
      root: null,
      rootMargin: "-73px 0px -100% 0px",
      threshold: [0],
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions,
    );

    const targetElem = document.getElementById("overlay-image");

    if (targetElem) observer.observe(targetElem);
    if (!targetElem) setImageTheme(false);

    return () => {
      if (targetElem) observer.unobserve(targetElem);
    };
  }, [pathname]);

  return (
    <div
      className={cn(
        "sticky left-0 top-0 z-[999] flex h-20 w-full items-center bg-white/70",
        imageTheme && "bg-white/10",
      )}
    >
      <div className="mx-auto flex h-full w-full max-w-screen-xl px-3 md:px-6">
        <div className="flex w-full items-center justify-between gap-2 sm:gap-5">
          <div className="relative flex w-full items-center gap-4 md:gap-6 lg:gap-8">
            <Link href={routes.home}>
              <div className="flex items-center gap-2 lg:gap-3">
                <div className="relative h-8 w-12 lg:h-9 lg:w-16">
                  <Image
                    src="/logos/HandoutsLOGO.png"
                    alt="Logo"
                    className=" object-contain"
                    fill
                  />
                </div>

                <p
                  className={cn(
                    "mt-1 hidden bg-gradient-to-br from-gray-900 via-gray-700 to-gray-200 bg-clip-text text-sm font-medium uppercase tracking-wide text-transparent sm:block sm:text-base",
                    imageTheme && "from-gray-50 via-gray-100 to-gray-500",
                  )}
                >
                  Handouts
                </p>
              </div>
            </Link>

            <Searchbar imageTheme={imageTheme} />
          </div>

          <div className="flex flex-shrink-0 items-center justify-end gap-5">
            <div className="hidden sm:block">
              <IconWrapper
                label="Categories"
                className={cn(
                  imageTheme &&
                    " border-white/30 bg-white/20 hover:bg-white/30 ",
                )}
                onClick={() => setCatsOpen(true)}
              >
                <LayoutGrid
                  className={cn(
                    "h-5 w-5 text-black",
                    imageTheme && "text-white",
                  )}
                />
              </IconWrapper>
            </div>

            <Link href={routes.favorites} className="hidden md:block">
              <IconWrapper
                label="Favourites"
                className={cn(
                  imageTheme && "border-white/30 bg-white/20 hover:bg-white/30",
                )}
              >
                <Heart
                  className={cn(
                    "h-5 w-5 text-black",
                    imageTheme && "text-white",
                  )}
                />
              </IconWrapper>
            </Link>

            <Link href={routes.cart} className="hidden md:block">
              <IconWrapper
                label="Cart"
                className={cn(
                  imageTheme && "border-white/30 bg-white/20 hover:bg-white/30",
                )}
              >
                <RiShoppingCartLine
                  className={cn(
                    "h-5 w-5 text-black",
                    imageTheme && "text-white",
                  )}
                />
              </IconWrapper>
            </Link>

            <UserAccount setCatsOpen={setCatsOpen} />
          </div>
        </div>
      </div>

      <Categories
        catsOpen={catsOpen}
        setCatsOpen={setCatsOpen}
        categories={categories}
      />
    </div>
  );
};
