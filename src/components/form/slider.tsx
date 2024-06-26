"use client";

import { ComponentPropsWithoutRef, forwardRef } from "react";
import { useFormStatus } from "react-dom";
import { Root } from "@radix-ui/react-slider";

import { Slider as ShadCNSlider } from "@/components/slider";
import { Label } from "@/components/ui/label";
import { FormErrors } from "@/components/form/form-errors";

interface SliderProps
  extends Omit<
    ComponentPropsWithoutRef<typeof Root>,
    "value" | "defaultValue"
  > {
  id: string;
  value?: string[];
  defaultValue?: string[];
  label: string;
  unit: string;
  errors?: Record<string, string[] | undefined>;
}

export const Slider = forwardRef<HTMLInputElement, SliderProps>(
  (
    {
      id,
      name,
      disabled,
      label,
      min = 0,
      unit,
      max = 100,
      value,
      defaultValue,
      errors,
      ...props
    },
    ref
  ) => {
    const { pending } = useFormStatus();

    const valuesStr = value || defaultValue;
    const values = valuesStr?.map((v) => +v.match(/(\d+|[^\d]+)/g)?.[0]!);

    return (
      <>
        <div>
          <Label htmlFor={id}>{label}</Label>

          <ShadCNSlider
            ref={ref}
            id={id}
            name={id}
            min={min}
            max={max}
            disabled={pending || disabled}
            aria-describedby={`${id}-error`}
            value={value && values}
            defaultValue={defaultValue && values}
            {...props}
          />
          <div className="flex justify-end mt-3 text-muted-foreground text-xs">
            {unit}
          </div>
        </div>

        <FormErrors id={id} errors={errors} />
      </>
    );
  }
);

Slider.displayName = "Slider";
