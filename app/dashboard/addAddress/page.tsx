import React from "react";

import { AddAddressForm } from "./_components/AddAddressForm";
import { HeadingWrapper } from "../_components/HeadingWrapper";
import getDBUser from "@/app/_serverActions/getDBUser";

const getExistingAddress = async (addressId: string | undefined) => {
  const existingAddress = (await getDBUser()).user?.addressDiary.filter(
    (addr) => addr.id === addressId,
  )[0];

  return existingAddress;
};

interface SearchParams {
  addressId?: string;
}

export default async function AddAddressPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const existingAddress = searchParams.addressId
    ? await getExistingAddress(searchParams.addressId)
    : undefined;

  if (searchParams.addressId && !existingAddress)
    return <p>Invalid Address Id</p>;

  return (
    <HeadingWrapper
      heading={searchParams.addressId ? "Edit Address" : "Add New Address"}
    >
      <AddAddressForm existingAddress={existingAddress} />
    </HeadingWrapper>
  );
}
