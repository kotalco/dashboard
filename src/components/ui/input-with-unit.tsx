import { useState, forwardRef } from "react";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface InputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "onChange" | "value"
  > {
  unit: string | { label: string; value: string }[];
  onChange: (value: string) => void;
  value: string;
}

const InputWithUnit = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, unit, value, onChange, ...props }, ref) => {
    const valueArray = value.match(/(\d+|[^\d]+)/g);
    const [amount, setAmount] = useState(() => {
      if (valueArray && valueArray.length === 2 && typeof unit === "object") {
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
      if (value && typeof unit === "object") {
        return onChange(value + selectedUnit);
      }
      onChange(value);
    };

    const handleUnitChange = (value: string) => {
      setSelectedUnit(value);
      onChange(amount + value);
    };

    return (
      <div className="relative">
        <Input
          type={type}
          className={className}
          value={amount || value}
          onChange={handleAmountChange}
          ref={ref}
          {...props}
        />
        {typeof unit === "string" && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <span className="text-muted-foreground sm:text-sm">{unit}</span>
          </div>
        )}

        {typeof unit === "object" && (
          <Select
            value={selectedUnit}
            onValueChange={handleUnitChange}
            disabled={props.disabled}
          >
            <SelectTrigger className="absolute inset-y-0 right-0 w-4/12 border-l-0 rounded-l-none">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {unit.map(({ label, value }) => (
                <SelectItem key={value} value={value}>
                  {label}
                  {Number(amount) !== 1 ? "s" : ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>
    );
  }
);
InputWithUnit.displayName = "InputWithUnit";

export { InputWithUnit };
