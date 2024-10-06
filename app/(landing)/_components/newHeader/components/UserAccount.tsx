"use client";
import React from "react";

import { useUser, SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/app/_utils/cn";
import { UserMenu } from "./UserMenu";

export const UserAccount = () => {
  const { user, isLoaded } = useUser();

  if (!isLoaded)
    return (
      <div className="flex flex-shrink-0 items-center justify-end xl:w-[206px]">
        <Skeleton className="h-9 w-9 rounded-full" />
      </div>
    );

  return (
    <>
      <SignedOut>
        <nav
          className="hidden w-full xl:block"
          aria-label="Desktop User Authentication"
        >
          <ul className="flex items-center gap-3">
            <li>
              <SignInButton>
                <Button variant={"secondary"}>Login</Button>
              </SignInButton>
            </li>
            <li>
              <SignUpButton>
                <Button className="flex-shrink-0">Get Started</Button>
              </SignUpButton>
            </li>
          </ul>
        </nav>
      </SignedOut>

      {user ? (
        <div
          className={cn(
            "flex flex-shrink-0 items-center justify-end xl:w-[206px]",
          )}
        >
          <UserMenu />
        </div>
      ) : (
        <div
          className={cn(
            "flex flex-shrink-0 items-center justify-start xl:hidden",
          )}
        >
          <UserMenu />
        </div>
      )}
    </>
  );
};
