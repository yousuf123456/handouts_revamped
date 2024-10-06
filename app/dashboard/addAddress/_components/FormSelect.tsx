import React from "react";

import { Address } from "@prisma/client";

import { FieldError, Controller, Control } from "react-hook-form";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "@/components/ui/select";

type FormSelectProps = {
  label: string;
  items: string[];
  id: keyof Address;
  validation?: object;
  control: Control<Address>;
  error: FieldError | undefined;
};

export const FormSelect: React.FC<FormSelectProps> = ({
  id,
  label,
  items,
  control,
  error,
  validation,
}) => (
  <div className="space-y-2">
    <Label htmlFor={id}>{label}</Label>
    <Controller
      name={id}
      control={control}
      rules={validation}
      render={({ field }) => (
        <Select onValueChange={field.onChange}>
          <SelectTrigger id={id}>
            <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
          </SelectTrigger>
          <SelectContent className="max-h-56 overflow-y-auto ">
            {items.map((item, i) => (
              <SelectItem key={i} value={item}>
                {item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    />
    {error && <p className="text-sm text-red-500">{error.message}</p>}
  </div>
);
