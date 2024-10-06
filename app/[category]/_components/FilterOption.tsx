import React, { useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { getSearchParamsStringsArray } from "@/app/_utils";
import { ProductFacets } from "@/app/[category]/_serverFunctions/getProductsFacets";

export const FilterOption = ({
  option,
  filterName,
}: {
  filterName: string;
  option: ProductFacets[number]["buckets"][number];
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // i.e attributes.color-brown,white|attributes.sizes-large,small
  const filters = searchParams.get("filters");

  // Get the current filter (facet) values from the url and make them all lowercase
  const filterSearchParamOpts = filters
    ?.split("|")
    .find((filter) => filter.split("-")[0] === `${filterName}`)
    ?.split("-")[1]
    ?.split(",")
    .map((option) => option.toLowerCase());

  useEffect(() => {}, [filters]);

  const onCheckboxClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    //@ts-ignore Check to see if the checkbox was checked
    const isAlreadyChecked = e.target.dataset.state === "checked";

    let searchParamStringsArray = getSearchParamsStringsArray(searchParams, [
      "filters",
    ]);

    // Remove a filter value if already checked other add
    if (isAlreadyChecked) {
      if (!filters || !filterSearchParamOpts) return;

      // Removing the value from the previous filter options applied in the url
      const newFilterSearchParamOpts = filterSearchParamOpts.filter(
        (opt) => opt !== option._id.toLowerCase(),
      );

      // Replacing the old filter in the url with new values
      const newFilters = filters
        .split("|")
        .map((filter) => {
          if (filter.split("-")[0] === `${filterName}`) {
            if (newFilterSearchParamOpts.length === 0) return;

            return `${filterName}-${newFilterSearchParamOpts.join(",")}`;
          }
          return filter;
        })
        .filter((filter) => filter)
        .join("|");

      if (newFilters) searchParamStringsArray.push(`filters=${newFilters}`);
    } else {
      // Add a new filter option in the options applied prev in the url
      const newFilterSearchParamOpts = [
        ...(filterSearchParamOpts || []),
        option._id.toLowerCase(),
      ];

      let newFilters: any;

      // Check to see if this filter is undefined or if there is no this filter applied to product yet
      if ((filterSearchParamOpts || []).length === 0) {
        newFilters = [
          ...(filters?.split("|") || []),
          `${filterName}-${newFilterSearchParamOpts.join(",")}`,
        ].join("|");
      } else {
        // Replace the old filter in the url with new values
        newFilters = filters
          ?.split("|")
          .map((filter) => {
            if (filter.split("-")[0] === `${filterName}`) {
              if (newFilterSearchParamOpts.length === 0) return;

              return `${filterName}-${newFilterSearchParamOpts.join(",")}`;
            }
            return filter;
          })
          .filter((filter) => filter)
          .join("|");
      }

      searchParamStringsArray.push(`filters=${newFilters}`);
    }

    router.push(`${pathname}?${searchParamStringsArray.join("&")}`);
  };

  const isChecked = !!filterSearchParamOpts?.includes(option._id.toLowerCase());

  return (
    <label className="mb-2 flex items-center">
      <Checkbox checked={isChecked} onClick={onCheckboxClick} />
      <span className="ml-2">{option._id}</span>
    </label>
  );
};
