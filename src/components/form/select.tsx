import React, { ComponentPropsWithoutRef } from "react";
import Link from "next/link";
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
import { FormDescription } from "@/components/form/form-description";
import { Button } from "@/components/ui/button";
import { FormErrors } from "@/components/form/form-errors";

import { cn } from "@/lib/utils";

interface SelectProps extends ComponentPropsWithoutRef<typeof Root> {
  id: string;
  label?: string;
  errors?: Record<string, string[] | undefined>;
  options: { value: string; label: string; disabled?: boolean }[];
  placeholder?: string;
  description?: string | React.ReactNode;
  className?: string;
  link?: { title: string; href: string };
  clear?: { onClear: () => void };
}

export const Select = ({
  disabled,
  label,
  id,
  errors,
  placeholder,
  options,
  description,
  className,
  link,
  clear,
  value,
  ...props
}: SelectProps) => {
  const { pending } = useFormStatus();

  return (
    <div className="space-y-2">
      <div className="space-y-1">
        {label && (
          <Label htmlFor={id} className="font-semibold text-neutral-700">
            {label}
          </Label>
        )}
        <div className="flex">
          <ShadSelect
            disabled={pending || disabled}
            name={id}
            aria-describedby={`${id}-error`}
            value={value}
            {...props}
          >
            <SelectTrigger
              id={id}
              data-testid={id}
              className={cn(className, "bg-white")}
            >
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map(({ value, label, disabled }) => (
                <SelectItem disabled={disabled} key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
              {link && (
                <Link
                  href={link.href}
                  className="text-sm text-primary hover:underline underline-offset-4"
                >
                  {link.title}
                </Link>
              )}
            </SelectContent>
          </ShadSelect>

          {clear && value && (
            <Button
              disabled={pending || disabled}
              type="button"
              variant="ghost"
              className="text-destructive hover:bg-transparent hover:text-destructive/70"
              onClick={() => clear.onClear()}
            >
              Clear
            </Button>
          )}
        </div>

        <FormDescription description={description} />
      </div>

      <FormErrors id={id} errors={errors} />
    </div>
  );
};
