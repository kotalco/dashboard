"use client";

import { useState, forwardRef } from "react";
import { useFormStatus } from "react-dom";

import { Input, InputProps } from "@/components/form/input";
import { Select } from "@/components/form/select";

import { OptionType } from "@/types";
import { FormErrors } from "./form-errors";

export interface InputWithUnitProps extends InputProps {
  unit: string | OptionType[];
  defaultValue: string;
}

const InputWithUnit = forwardRef<HTMLInputElement, InputWithUnitProps>(
  ({ unit, defaultValue, label, id, errors, ...props }, ref) => {
    const { pending } = useFormStatus();
    const valueArray = defaultValue.match(/(\d+|[^\d]+)/g);
    const [amount, setAmount] = useState(() => {
      if (valueArray) {
        return valueArray[0];
      }
    });

    const [selectedUnit, setSelectedUnit] = useState(() => {
      if (valueArray && valueArray.length === 2 && typeof unit === "object") {
        return valueArray[1];
      }
    });

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;

      setAmount(value);
    };

    const handleUnitChange = (value: string) => {
      setSelectedUnit(value);
    };

    return (
      <div className="space-y-2">
        <div className="relative">
          <Input
            id={`${id}-amount`}
            label={label}
            value={amount}
            onChange={handleAmountChange}
            ref={ref}
            {...props}
          />
          {typeof unit === "string" && (
            <div className="absolute bottom-0 h-10 right-0 flex items-center pr-3 pointer-events-none">
              <span className="text-muted-foreground sm:text-sm">
                {Number(amount) > 1 ? `${unit}s` : unit}
              </span>
            </div>
          )}

          {typeof unit === "object" && (
            <Select
              id={`${id}-unit`}
              value={selectedUnit}
              onValueChange={handleUnitChange}
              disabled={pending || props.disabled}
              className="absolute bottom-0 h-10 right-0 w-4/12 border-l-0 rounded-l-none"
              options={unit.map(({ label, value }) => ({
                label: `${label}${Number(amount) > 1 ? "s" : ""}`,
                value,
              }))}
            />
          )}
        </div>
        <FormErrors id={id} errors={errors} />
      </div>
    );
  }
);
InputWithUnit.displayName = "InputWithUnit";

export { InputWithUnit };
