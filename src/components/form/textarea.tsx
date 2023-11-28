"use client";

import React, { InputHTMLAttributes, forwardRef } from "react";
import { useFormStatus } from "react-dom";

import { Textarea as STextarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FormErrors } from "@/components/form/form-errors";

import { cn } from "@/lib/utils";
import { FormDescription } from "./form-description";
import { type } from "os";

export interface TextareaProps
  extends InputHTMLAttributes<HTMLTextAreaElement> {
  id: string;
  label?: string;
  errors?: Record<string, string[] | undefined>;
  description?: string | React.ReactNode;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      errors,
      id,
      disabled,
      className,
      description,
      defaultValue,
      ...props
    },
    ref
  ) => {
    const { pending } = useFormStatus();
    const formattedDefaultValue =
      typeof defaultValue === "object" ? defaultValue.join("\n") : defaultValue;

    return (
      <div className="space-y-2">
        <div className="space-y-1">
          {label && (
            <Label htmlFor={id} className="font-semibold text-neutral-700">
              {label}
            </Label>
          )}
          <STextarea
            ref={ref}
            id={id}
            name={id}
            disabled={pending || disabled}
            aria-describedby={`${id}-error`}
            className={cn(className)}
            defaultValue={formattedDefaultValue}
            {...props}
          />
          <FormDescription description={description} />
        </div>

        <FormErrors id={id} errors={errors} />
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
