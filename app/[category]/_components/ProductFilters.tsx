import React from "react";
import { FiltersList } from "./FiltersList";
import { getProductsFacets } from "@/app/[category]/_serverFunctions/getProductsFacets";

export const ProductFilters = async (props: {
  category: string;
  query: string | undefined;
  storeId: string | undefined;
}) => {
  const facetsData = await getProductsFacets(props);

  const facets = facetsData[0].facet;

  return <FiltersList filters={facets} />;
};
