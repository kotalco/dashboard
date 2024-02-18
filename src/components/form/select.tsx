import Link from "next/link";
import Image from "next/image";
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
import { FormDescription } from "@/components/form/form-description";
import { Button } from "@/components/ui/button";
import { FormErrors } from "@/components/form/form-errors";

import { cn } from "@/lib/utils";
import { OptionType } from "@/types";

interface SelectProps extends ComponentPropsWithoutRef<typeof Root> {
  id: string;
  label?: string;
  errors?: Record<string, string[] | undefined>;
  options: OptionType[];
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
        {label && <Label htmlFor={id}>{label}</Label>}
        <div className="flex">
          <ShadSelect
            disabled={pending || disabled}
            name={id}
            aria-describedby={`${id}-error`}
            value={value}
            {...props}
          >
            <SelectTrigger id={id} data-testid={id} className={cn(className)}>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map(({ value, label, disabled, image }) => (
                <SelectItem disabled={disabled} key={value} value={value}>
                  {image && (
                    <Image
                      width={24}
                      height={24}
                      alt="decoration"
                      src={image}
                      className="w-6 h-6 inline-block mr-3"
                    />
                  )}
                  <span>{label}</span>
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
