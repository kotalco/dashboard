"use client";

import React, { InputHTMLAttributes, forwardRef } from "react";
import { useFormStatus } from "react-dom";
import { AlertCircle } from "lucide-react";

import { Textarea as STextarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FormErrors } from "@/components/form/form-errors";
import { FormDescription } from "@/components/form/form-description";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { cn } from "@/lib/utils";

export interface TextareaProps
  extends InputHTMLAttributes<HTMLTextAreaElement> {
  id: string;
  label?: string;
  errors?: Record<string, string[] | undefined>;
  description?: string | React.ReactNode;
  tooltip?: string;
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
      tooltip,
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
          <div>
            {label && (
              <Label htmlFor={id} className="font-semibold text-neutral-700">
                {label}
              </Label>
            )}
            {tooltip && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <AlertCircle className="w-3 h-3 ml-2" />
                  </TooltipTrigger>
                  <TooltipContent>{tooltip}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>

          <STextarea
            ref={ref}
            id={id}
            name={id}
            disabled={pending || disabled}
            aria-describedby={`${id}-error`}
            className={cn(className, "resize-none")}
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
