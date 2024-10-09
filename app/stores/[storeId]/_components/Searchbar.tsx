"use client";
import React, { useState } from 'react'

import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export const Searchbar = ({storeId}: {storeId: string}) => {
    const [query, setQuery] = useState("");

  return (
              <form className="my-3 flex w-full max-w-2xl items-center space-x-2">
            <Input
              type="search"
              value={query}
              className="flex-grow"
              placeholder="Search products in store..."
              onChange={(e)=> setQuery(e.target.value)}
            />

            <Link
              href={`/search?q=${query}&storeId=${storeId}`}
              className={buttonVariants({
                size: "icon",
                className: "flex-shrink-0",
              })}
            >
              <Search className="h-4 w-4" />
            </Link>
          </form>
  )
}
