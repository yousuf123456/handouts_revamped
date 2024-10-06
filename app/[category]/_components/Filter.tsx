import React, { useState } from "react";

import { FilterOption } from "./FilterOption";
import { ProductFacets } from "@/app/[category]/_serverFunctions/getProductsFacets";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

type FilterProps = {
  name: string;
  filterOptions: ProductFacets[number]["buckets"];
};

export const Filter = ({ name, filterOptions }: FilterProps) => {
  const [showingAll, setShowingAll] = useState(false);

  return (
    <div className="mb-4">
      <h3 className="mb-2 font-medium capitalize">{name}</h3>
      {filterOptions.map((option, i) => {
        if (i > 5 && !showingAll) return;

        return <FilterOption key={i} option={option} filterName={name} />;
      })}

      {filterOptions.length > 6 && (
        <Button
          variant="link"
          className="mt-2 h-auto p-0 font-semibold text-primary"
          onClick={() => setShowingAll((prev) => !prev)}
        >
          {showingAll ? (
            <>
              <ChevronUp className="mr-1 h-4 w-4" />
              Show less
            </>
          ) : (
            <>
              <ChevronDown className="mr-1 h-4 w-4" />
              Show All
            </>
          )}
        </Button>
      )}
    </div>
  );
};
