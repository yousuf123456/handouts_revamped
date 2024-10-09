"use client";
import React, { useEffect, useState } from "react";

import citiesList from "@/public/cities.json";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { Controller, useForm } from "react-hook-form";

import { Address } from "@prisma/client";
import { FormField } from "./FormField";
import { FormSelect } from "./FormSelect";
import { addAddress } from "../_serverActions/addAddress";
import { toast } from "sonner";
import { routes } from "@/app/_config/routes";
import { useRouter, useSearchParams } from "next/navigation";

const provinces = [
  "Azad Kashmir",
  "Balochistān",
  "Gilgit-Baltistan",
  "Islamabad",
  "Khyber Pakhtunkhwa",
  "Punjab",
  "Sindh",
];

export const AddAddressForm = ({
  existingAddress,
}: {
  existingAddress: Address | undefined;
}) => {
  const [isPerformingAction, setIsPerformingAction] = useState(false);

  const [provinceSelectedCities, setProvinceSelectedCities] = useState<
    string[]
  >([]);

  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Address>({
    defaultValues: {
      type: "Home",
      isDefaultBillingAddress: false,
      isDefaultShippingAddress: false,
      ...existingAddress,
    },
  });

  const provinceSelected = watch("province");

  useEffect(() => {
    if (provinceSelected) {
      if (provinceSelected === "Islamabad")
        setProvinceSelectedCities(["Islamabad"]);
      else
        setProvinceSelectedCities(
          citiesList
            .filter(
              (cityData) =>
                cityData.admin_name.toLowerCase() ===
                provinceSelected.toLowerCase(),
            )
            .map((cityData) => cityData.city),
        );
    }
  }, [provinceSelected]);

  const router = useRouter();
  const redirectUrl = useSearchParams().get("redirectUrl");

  const onSubmit = (data: Address) => {
    setIsPerformingAction(true);

    toast.promise(
      addAddress({
        newAddress: data,
        addressId: existingAddress?.id,
        editExistingAddress: !!existingAddress,
      }),
      {
        loading: existingAddress ? "Editing address" : "Adding a new address",
        success(data) {
          if (data.success) {
            if (redirectUrl) router.push(redirectUrl);
            else router.push(routes.addressDiary);
            return data.message;
          } else throw new Error(data.message);
        },
        error(data) {
          return data.message;
        },
        finally() {
          setIsPerformingAction(false);
        },
      },
    );
  };

  return (
    <Card className="w-full p-3">
      <CardContent className="px-2">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              id="fullName"
              label="Full Name"
              register={register}
              error={errors.fullName}
              placeholder="E.g. Aryan Ahmed"
              validation={{ required: "Name is required" }}
            />

            <FormField
              id="phone"
              label="Phone Number"
              placeholder="Enter Your Phone Number"
              register={register}
              error={errors.phone}
              validation={{ required: "Phone number is required" }}
            />
          </div>

          <FormField
            id="address"
            label="Street Address"
            placeholder="House no / building / street / area"
            register={register}
            error={errors.address}
            validation={{ required: "Street address is required" }}
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <FormSelect
              id="province"
              label="Province"
              items={provinces}
              control={control}
              error={errors.province}
              validation={{ required: "Province is required" }}
            />

            <FormSelect
              id="city"
              label="City"
              items={provinceSelectedCities}
              control={control}
              error={errors.city}
              validation={{ required: "City is required" }}
            />

            <FormField
              id="area"
              label="Area"
              placeholder="E.g. Bahria Town / DHA"
              register={register}
              error={errors.area}
              validation={{ required: "Area of city is required" }}
            />
          </div>

          <FormField
            id="landmark"
            label="Landmark"
            register={register}
            placeholder="E.g. Near the airport"
          />

          <div className="space-y-2">
            <Label>Address Type</Label>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  onValueChange={field.onChange as any}
                  defaultValue={field.value}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Home" id="home" />
                    <Label htmlFor="Home">Home</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Office" id="office" />
                    <Label htmlFor="Office">Office</Label>
                  </div>
                </RadioGroup>
              )}
            />
          </div>

          <div className="space-y-2">
            {["isDefaultBillingAddress", "isDefaultShippingAddress"].map(
              (field, i) => (
                <div key={i} className="flex items-center space-x-2">
                  <Controller
                    control={control}
                    name={field as keyof Address}
                    render={({ field: checkboxField }) => (
                      <Checkbox
                        id={field}
                        disabled={
                          !!existingAddress &&
                          !!existingAddress[field as keyof Address]
                        }
                        checked={checkboxField.value as any}
                        onCheckedChange={(checked) =>
                          checkboxField.onChange(checked as boolean)
                        }
                      />
                    )}
                  />
                  <Label htmlFor={field}>
                    {`Set as default ${
                      field === "isDefaultBillingAddress"
                        ? "billing"
                        : "shipping"
                    } address`}
                  </Label>
                </div>
              ),
            )}
          </div>

          <Button
            type="submit"
            className="mt-6 w-full"
            disabled={isPerformingAction}
          >
            Add Address
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
