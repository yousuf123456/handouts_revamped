"use client";
import { useState } from "react";
import Image from "next/image";

import {
  useUser,
  useClerk,
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
} from "@clerk/nextjs";

import { usePathname, useSearchParams } from "next/navigation";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import Link from "next/link";

import {
  LogOutIcon,
  User,
  Star,
  ShoppingBag,
  CircleOff,
  Undo2,
  StarHalf,
  MapPin,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { getSearchParamsStringsArray } from "@/app/_utils";
import { routes } from "@/app/_config/routes";

export const UserMenu = () => {
  const [open, setOpen] = useState(false);

  const { isLoaded, user } = useUser();
  const { signOut, openUserProfile } = useClerk();

  const pathname = usePathname();
  const searchParams = useSearchParams();

  const onSignOut = () => {
    const searchParamsArray = getSearchParamsStringsArray(searchParams, []);

    signOut({ redirectUrl: `${pathname}?${searchParamsArray.join("&")}` });
  };

  if (!isLoaded) return null;

  return (
    <>
      <DropdownMenu open={open} onOpenChange={setOpen} modal={false}>
        <DropdownMenuTrigger>
          <div className="relative h-9 w-9 overflow-hidden rounded-full">
            <Image
              src={user?.imageUrl || "/placeholder.jpg"}
              alt={
                user?.primaryEmailAddress?.emailAddress! || "not signed in user"
              }
              fill
            />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          sideOffset={20}
          className="w-72 max-w-xl rounded-xl min-[360px]:w-80"
        >
          <DropdownMenuLabel className="py-3" asChild>
            {user ? (
              <div className="flex items-center gap-3">
                <div className="relative h-9 w-9 flex-shrink-0 overflow-hidden rounded-full">
                  <Image
                    src={user.imageUrl}
                    alt={user.primaryEmailAddress?.emailAddress!}
                    fill
                  />
                </div>

                <div className="flex flex-col gap-0">
                  <p className="text-zinc-700">
                    {user.username ||
                      (user.firstName || "") + " " + (user.lastName || "")}
                  </p>
                  <p className="line-clamp-1 text-xs text-zinc-500">
                    {user.primaryEmailAddress?.emailAddress}
                  </p>
                </div>
              </div>
            ) : (
              <p className="pl-6 text-start text-zinc-600">My Account</p>
            )}
          </DropdownMenuLabel>

          <DropdownMenuSeparator />

          <div
            className="max-h-72 overflow-y-auto overflow-x-hidden scrollbar-thin"
            data-lenis-prevent
          >
            {user && (
              <>
                <Link href={routes.addressDiary}>
                  <DropdownMenuItem>
                    <MapPin className="mr-4 h-4 w-4 text-zinc-700" />
                    <span>Address Diary</span>
                  </DropdownMenuItem>
                </Link>

                <Link href={routes.orders}>
                  <DropdownMenuItem>
                    <ShoppingBag className="mr-4 h-4 w-4 text-zinc-700" />
                    <span>Orders</span>
                  </DropdownMenuItem>
                </Link>

                <Link href={routes.cancelledOrders}>
                  <DropdownMenuItem>
                    <CircleOff className="mr-4 h-4 w-4 text-zinc-700" />
                    <span>Cancelled Orders</span>
                  </DropdownMenuItem>
                </Link>

                <Link href={routes.returnedOrders}>
                  <DropdownMenuItem>
                    <Undo2 className="mr-4 h-4 w-4 text-zinc-700" />
                    <span>Returned Orders</span>
                  </DropdownMenuItem>
                </Link>

                <Link href={routes.pendingReviews}>
                  <DropdownMenuItem>
                    <StarHalf className="mr-4 h-4 w-4 text-zinc-700" />
                    <span>Pending Reviews</span>
                  </DropdownMenuItem>
                </Link>

                <Link href={routes.publishedReviews}>
                  <DropdownMenuItem>
                    <Star className="mr-4 h-4 w-4 text-zinc-700" />
                    <span>Published Reviews</span>
                  </DropdownMenuItem>
                </Link>

                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={() => openUserProfile()}>
                  <User className="mr-4 h-4 w-4 text-zinc-700" />
                  <span>Manage Account</span>
                </DropdownMenuItem>
              </>
            )}
          </div>

          <DropdownMenuSeparator />

          <SignedIn>
            <DropdownMenuItem onClick={onSignOut}>
              <LogOutIcon className="mr-4 h-4 w-4 text-zinc-700" />
              <span>Logout</span>
            </DropdownMenuItem>
          </SignedIn>
          <SignedOut>
            <nav aria-label="Mobile User Authentication">
              <ul className="flex w-full flex-col gap-2 p-1">
                <li>
                  <SignInButton>
                    <Button
                      className="w-full"
                      variant={"secondary"}
                      onClick={() => setOpen(false)}
                    >
                      Login
                    </Button>
                  </SignInButton>
                </li>
                <li>
                  <SignUpButton>
                    <Button onClick={() => setOpen(false)} className="w-full">
                      Get Started
                    </Button>
                  </SignUpButton>
                </li>
              </ul>
            </nav>
          </SignedOut>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
