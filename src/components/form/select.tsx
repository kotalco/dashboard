import React, { ComponentPropsWithoutRef } from "react";
import { useFormStatus } from "react-dom";
import { Root } from "@radix-ui/react-select";

import {
  Select as ShadSelect,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

import { cn } from "@/lib/utils";

import { FormErrors } from "./form-errors";

interface SelectProps extends ComponentPropsWithoutRef<typeof Root> {
  id: string;
  label?: string;
  errors?: Record<string, string[] | undefined>;
  options: { value: string; label: string; disabled?: boolean }[];
  placeholder?: string;
  description?: string | React.ReactNode;
  className?: string;
}

export const Select: React.FC<SelectProps> = ({
  disabled,
  label,
  id,
  errors,
  placeholder,
  options,
  description,
  className,
  ...props
}) => {
  const { pending } = useFormStatus();

  return (
    <div className="space-y-2">
      <div className="space-y-1">
        {label && (
          <Label htmlFor={id} className="font-semibold text-neutral-700">
            {label}
          </Label>
        )}
        <ShadSelect
          disabled={pending || disabled}
          name={id}
          aria-describedby={`${id}-error`}
          {...props}
        >
          <SelectTrigger
            id={id}
            data-testid={id}
            className={cn(className, "bg-white max-w-xs")}
          >
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options.map(({ value, label, disabled }) => (
              <SelectItem disabled={disabled} key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </ShadSelect>
      </div>

      {typeof description === "string" ? (
        <p className="text-sm text-foreground">{description}</p>
      ) : (
        description
      )}

      <FormErrors id={id} errors={errors} />
    </div>
  );
};
