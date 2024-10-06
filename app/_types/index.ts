import { Address, User } from "@prisma/client";

export type ProductAttributes = {
  [key: string]: string | string[];
};

export type ActionResult<T = unknown> = {
  success: boolean;
  message: string;
  data?: T;
};

export type FilterStringType = `${string}-${string}`;
export type SortStringType = `${string}-${"asc" | "desc"}`;
export type FiltersStringType = `${FilterStringType}|${FilterStringType}`;

export type PaginationParams = {
  page: number | undefined;
  sort: SortStringType | undefined;
  filter: FilterStringType | undefined;
};

export type PaginationSearchParams = {
  page: string | undefined;
  sort: SortStringType | undefined;
  filter: FilterStringType | undefined;
};

export type AtlasSearchPaginationParams = {
  paginationToken: string;
  pageDirection: "next" | "prev";
  filters: FiltersStringType | undefined;
};

export type AtlasSearchPaginationSearchParams = {
  pageDirection: string;
  paginationToken: string;
  filters: string | undefined;
};

export interface VariantsType {
  [key: string]: {
    title: string;
    [key: string]:
      | {
          title: string;
        }
      | any;
  };
}

interface BaseUser {
  id: string;
  authUserId: string;
  addressDiary: Address[];
  favouriteItemIds: string[];
}

type ExtendedUser = BaseUser & User;

export type ExtendedUserOnlyKeys = Exclude<keyof ExtendedUser, keyof BaseUser>;

export type UserType<
  T extends { includeFields?: Partial<Record<ExtendedUserOnlyKeys, any>> },
> = BaseUser & {
  [K in keyof ExtendedUser as K extends keyof T["includeFields"]
    ? T["includeFields"][K] extends true // Check if field should be included
      ? K
      : never
    : never]: ExtendedUser[K];
};
