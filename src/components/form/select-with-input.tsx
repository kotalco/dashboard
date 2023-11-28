import { useFormStatus } from "react-dom";
import React, { ComponentPropsWithoutRef, useState } from "react";
import { Root } from "@radix-ui/react-select";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FormDescription } from "@/components/form/form-description";
import { FormErrors } from "@/components/form/form-errors";

import { cn } from "@/lib/utils";
import { OptionType } from "@/types";

interface SelectWithInputProps extends ComponentPropsWithoutRef<typeof Root> {
  id: string;
  label?: string;
  options: OptionType[];
  placeholder?: string;
  otherLabel?: string;
  allowClear?: boolean;
  errors?: Record<string, string[] | undefined>;
  className?: string;
  description?: string | React.ReactNode;
}

export const SelectWithInput: React.FC<SelectWithInputProps> = ({
  id,
  label,
  disabled,
  defaultValue,
  options,
  placeholder,
  otherLabel = "Other",
  allowClear = false,
  description,
  errors,
  ...props
}) => {
  const { pending } = useFormStatus();
  const [selected, setSelected] = useState(() => {
    if (!defaultValue) return "";
    return options.some(({ value }) => value === defaultValue)
      ? defaultValue
      : "other";
  });

  const handleClear = () => {
    setSelected("");
  };

  return (
    <div className="space-y-2">
      <div className="space-y-1">
        {label && (
          <Label htmlFor={id} className="font-semibold text-neutral-700">
            {label}
          </Label>
        )}
        <div className="flex">
          <Select
            name={`${id}-select`}
            disabled={pending || disabled}
            onValueChange={setSelected}
            defaultValue={defaultValue}
            value={selected}
            {...props}
          >
            <SelectTrigger
              id={id}
              className={cn(
                selected === "other" ? "rounded-b-none" : "",
                "bg-white max-w-sm"
              )}
            >
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map(({ value, label }) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
              <SelectItem
                value="other"
                className="text-primary focus:text-primary"
              >
                {otherLabel}
              </SelectItem>
            </SelectContent>
          </Select>

          {selected && selected !== "other" && allowClear && (
            <Button
              type="button"
              variant="ghost"
              className="text-destructive hover:bg-transparent hover:text-destructive/70"
              onClick={handleClear}
            >
              Clear
            </Button>
          )}
        </div>

        {selected === "other" && (
          <div>
            <Input
              id={id}
              name={`${id}-input`}
              disabled={pending || disabled}
              type="text"
              className="-mt-1.5 border-t-0 rounded-t-none max-w-sm"
              defaultValue={selected === "other" ? defaultValue : undefined}
            />
          </div>
        )}

        <FormDescription description={description} />

        <FormErrors id={id} errors={errors} />
      </div>
    </div>
  );
};
