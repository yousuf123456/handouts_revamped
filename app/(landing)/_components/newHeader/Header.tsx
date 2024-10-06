"use client";
import React, { useEffect, useState } from "react";

import Link from "next/link";
import Image from "next/image";

import { Heart } from "lucide-react";
import { routes } from "@/app/_config/routes";
import { Searchbar } from "./components/Searchbar";
import { RiShoppingCartLine } from "react-icons/ri";
import { IconWrapper } from "./components/IconWrapper";
import { UserAccount } from "./components/UserAccount";
import { cn } from "@/app/_utils/cn";
import { usePathname } from "next/navigation";

export const Header = () => {
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
                <div className="relative h-8 w-8 lg:h-9 lg:w-9">
                  <Image src="/logos/HandoutsLOGO.png" alt="Logo" fill />
                </div>

                <p
                  className={cn(
                    "mt-1 hidden text-sm font-medium uppercase tracking-wide text-black sm:block sm:text-base",
                    imageTheme && "text-white",
                  )}
                >
                  Handouts
                </p>
              </div>
            </Link>

            <Searchbar imageTheme={imageTheme} />
          </div>

          <div className="flex flex-shrink-0 items-center justify-end gap-5">
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

            <UserAccount />
          </div>
        </div>
      </div>
    </div>
  );
};
