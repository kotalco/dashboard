"use client";

import { InputHTMLAttributes, forwardRef } from "react";
import { useFormStatus } from "react-dom";

import { Input as ShadInput } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { FormErrors } from "./form-errors";
import { cn } from "@/lib/utils";
import { FormDescription } from "./form-description";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label?: string;
  errors?: Record<string, string[] | undefined>;
  description?: string | React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, errors, id, disabled, className, description, ...props }, ref) => {
    const { pending } = useFormStatus();

    return (
      <div className="space-y-2">
        <div className="space-y-1">
          {label && (
            <Label htmlFor={id} className="font-semibold text-neutral-700">
              {label}
            </Label>
          )}
          <ShadInput
            ref={ref}
            id={id}
            name={id}
            disabled={pending || disabled}
            aria-describedby={`${id}-error`}
            className={cn(className)}
            {...props}
          />
          <FormDescription description={description} />
        </div>

        <FormErrors id={id} errors={errors} />
      </div>
    );
  }
);

Input.displayName = "Input";
