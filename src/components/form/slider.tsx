"use client";

import { ComponentPropsWithoutRef, forwardRef } from "react";
import { useFormStatus } from "react-dom";
import { Root } from "@radix-ui/react-slider";

import { Slider as ShadCNSlider } from "@/components/slider";
import { Label } from "@/components/ui/label";

interface SliderProps
  extends Omit<
    ComponentPropsWithoutRef<typeof Root>,
    "value" | "defaultValue"
  > {
  value?: string[];
  defaultValue?: string[];
  label: string;
  unit: string;
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
      ...props
    },
    ref
  ) => {
    const { pending } = useFormStatus();

    const valuesStr = value || defaultValue;
    const values = valuesStr?.map((v) => +v.match(/(\d+|[^\d]+)/g)?.[0]!);

    return (
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
        <div className="flex justify-between mt-3 text-muted-foreground text-xs">
          <span>
            Min {min} {min > 1 ? `${unit}s` : unit}
          </span>
          <span>
            Max {max} {max > 1 ? `${unit}s` : unit}
          </span>
        </div>
      </div>
    );
  }
);

Slider.displayName = "Slider";
