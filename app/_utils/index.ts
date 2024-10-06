import { ReadonlyURLSearchParams } from "next/navigation";

// Returns an array of search params as string array. i.e 'query=hello world'
export const getSearchParamsStringsArray = (
  searchParams: ReadonlyURLSearchParams,
  paramsToRemove: string[],
  getOnlyValues?: boolean,
) => {
  let paramsArray = [];
  //@ts-ignore
  for (const [key, value] of searchParams.entries()) {
    if (paramsToRemove.includes(key)) continue;
    if (getOnlyValues) paramsArray.push(value);

    if (getOnlyValues) continue;
    paramsArray.push(`${key}=${value}`);
  }

  return paramsArray;
};

export const scrollToElement = (elementId: string, topOffset?: number) => {
  const element = document.getElementById(elementId);

  if (element) {
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.scrollY - (topOffset || 0);

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });
  }
};

export const calculateItemsToSkip = (
  currentPage: number,
  itemsPerPage: number,
) => {
  return ((currentPage || 1) - 1) * itemsPerPage;
};
