import React from "react";

import { UseFormRegister, FieldError } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Address } from "@prisma/client";

type FormFieldProps = {
  label: string;
  id: keyof Address;
  placeholder: string;
  validation?: object;
  error?: FieldError | undefined;
  register: UseFormRegister<Address>;
};

export const FormField = ({
  id,
  label,
  placeholder,
  register,
  error,
  validation,
}: FormFieldProps) => (
  <div className="space-y-2">
    <Label htmlFor={id}>{label}</Label>
    <Input id={id} placeholder={placeholder} {...register(id, validation)} />
    {error && <p className="text-sm text-red-500">{error.message}</p>}
  </div>
);
