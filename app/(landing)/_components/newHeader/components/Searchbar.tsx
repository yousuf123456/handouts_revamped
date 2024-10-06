"use client";

import React, { useEffect, useRef, useState } from "react";
import { IconWrapper } from "./IconWrapper";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { absoluteUrl } from "@/app/_config/routes";
import { useDebounce } from "use-debounce";

export const Searchbar = ({ imageTheme }: { imageTheme: boolean }) => {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const [debouncedQueryValue] = useDebounce(query, 500);

  const [autoCompletes, setAutoCompletes] = useState<{ name: string }[]>([]);
  const [selectedAutocompInd, setSelectedAutocompInd] = useState<null | number>(
    null,
  );

  const autocompletesContRef = useRef<HTMLDivElement | null>(null);

  const router = useRouter();

  const onSearch = (autoComplete?: string) => {
    // Expand the search input
    if (!focused) {
      setFocused(true);
      document.getElementById("searchbar_input")?.focus();

      return;
    }

    // Take to the search page
    const queryParamValue =
      autoComplete ||
      autoCompletes.at(selectedAutocompInd || -1)?.name ||
      query;

    router.push(`/search?q=${queryParamValue}&from=input`);

    setAutoCompletes([]);
  };

  // Get the autocompletes
  useEffect(() => {
    if (!query.length) return;

    const body = {
      searchTerm: query,
    };

    async function autoCompletes() {
      const response = await fetch(absoluteUrl("/api/getAutoCompletes"), {
        method: "post",
        body: JSON.stringify(body),
      });

      const results = await response.json();
      setAutoCompletes(results);
    }

    autoCompletes();
  }, [debouncedQueryValue]);

  // Scroll down or up automatically when user goes through autocompletes using his keyboard
  useEffect(() => {
    if (selectedAutocompInd === null) return;

    const container = autocompletesContRef.current;
    const item = document.querySelector(".selected-autocomplete");

    if (!item || !container) return;

    const containerRect = container.getBoundingClientRect();
    const itemRect = item.getBoundingClientRect();

    if (itemRect.bottom > containerRect.bottom) {
      container.scrollTop += itemRect.bottom - containerRect.bottom;
    } else if (itemRect.top < containerRect.top) {
      container.scrollTop -= containerRect.top - itemRect.top;
    }
  }, [selectedAutocompInd]);

  // Select the next autocomplete
  const onArrowDown = () => {
    if (autoCompletes.length === 0) return;

    if (selectedAutocompInd === null) setSelectedAutocompInd(0);
    else if (selectedAutocompInd === autoCompletes.length - 1)
      setSelectedAutocompInd(null);
    else setSelectedAutocompInd((prev) => prev! + 1);
  };

  // Select the previous autocomplete
  const onArrowUp = () => {
    if (autoCompletes.length === 0) return;

    if (selectedAutocompInd === null)
      setSelectedAutocompInd(autoCompletes.length - 1);
    else if (selectedAutocompInd === 0) setSelectedAutocompInd(null);
    else setSelectedAutocompInd((prev) => prev! - 1);
  };

  // Perform Actions Based on What Key was Pressed
  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") onSearch();
    if (e.key === "ArrowUp") onArrowUp();
    if (e.key === "ArrowDown") onArrowDown();
  };

  return (
    <div className="relative z-[99] flex w-full items-center justify-end gap-0">
      <Input
        tabIndex={0}
        value={
          selectedAutocompInd === null
            ? query
            : autoCompletes[selectedAutocompInd]?.name
        }
        id="searchbar_input"
        onKeyDown={onKeyDown}
        onBlur={(e) => {
          if (
            e.relatedTarget?.id === "autocomplete" ||
            e.relatedTarget?.id === "search"
          ) {
            e.preventDefault();
            return;
          }

          setFocused(false);
        }}
        placeholder="Search in Handouts"
        className={cn(
          "font-roboto rounded-l-md rounded-r-none border-r-[0px] transition-all",
          focused ? "w-full opacity-100" : "w-0 opacity-0",
        )}
        onChange={(e) => setQuery(e.target.value)}
      />

      <IconWrapper
        id="search"
        tabIndex={1}
        onClick={() => onSearch()}
        className={cn(
          "transition-all ease-in",
          focused && "rounded-l-none",
          imageTheme && "border-white/30 bg-white/20 hover:bg-white/30",
        )}
      >
        <Search
          className={cn(
            "h-4 w-4 text-black md:h-5 md:w-5",
            imageTheme && "text-white",
          )}
        />
      </IconWrapper>

      {autoCompletes.length > 0 && focused && (
        <div
          ref={autocompletesContRef}
          className={cn(
            "absolute left-0 right-0 top-14 z-[9999] max-h-52 overflow-y-auto rounded-md bg-white p-3 drop-shadow-md scrollbar-thin",
          )}
        >
          <ul className="flex flex-col">
            {autoCompletes.map((autocomplete, i) => (
              <li
                key={i}
                tabIndex={0}
                id="autocomplete"
                onClick={() => onSearch(autoCompletes[i].name)}
                className={cn(
                  "flex flex-col gap-3 rounded-lg px-2 py-4 transition-colors hover:bg-zinc-100",
                  selectedAutocompInd === i &&
                    "selected-autocomplete bg-zinc-100",
                )}
              >
                <p className="text-[13px] font-medium leading-4 text-zinc-700">
                  {autocomplete["name"]}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
