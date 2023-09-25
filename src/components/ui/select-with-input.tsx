import { useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface SelectWithInputProps {
  disabled?: boolean;
  onChange: (e: string) => void;
  value: string;
  defaultValue?: string;
  options: { label: string; value: string }[];
  placeholder?: string;
  otherLabel?: string;
}

export const SelectWithInput: React.FC<SelectWithInputProps> = ({
  disabled,
  onChange,
  value,
  defaultValue,
  options,
  placeholder,
  otherLabel = "Other",
}) => {
  const [selected, setSelected] = useState(defaultValue);

  const handleChange = (value: string) => {
    setSelected(value);
    if (value !== "other") {
      onChange(value);
    } else {
      onChange("");
    }
  };

  return (
    <>
      <Select
        disabled={disabled}
        onValueChange={handleChange}
        defaultValue={defaultValue}
        value={selected}
      >
        <SelectTrigger
          className={cn(
            selected === "other" ? "rounded-b-none" : "",
            "bg-white focus:ring-transparent"
          )}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map(({ value, label }) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
          <SelectItem value="other" className="text-primary focus:text-primary">
            {otherLabel}
          </SelectItem>
        </SelectContent>
      </Select>

      {selected === "other" && (
        <div>
          <Input
            disabled={disabled}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="-mt-1.5 border-t-0 rounded-t-none focus-visible:ring-transparent"
          />
        </div>
      )}
    </>
  );
};
