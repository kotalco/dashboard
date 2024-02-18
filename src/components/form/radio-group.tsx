import { useFormStatus } from "react-dom";
import { ComponentPropsWithoutRef } from "react";
import { Root } from "@radix-ui/react-radio-group";

import { Label } from "@/components/ui/label";
import { FormErrors } from "@/components/form/form-errors";
import {
  RadioGroupItem,
  RadioGroup as SRadioGroup,
} from "@/components/ui/radio-group";
import { OptionType } from "@/types";

interface RadioGroupProps extends ComponentPropsWithoutRef<typeof Root> {
  id: string;
  label?: string;
  errors?: Record<string, string[] | undefined>;
  options: OptionType[];
}

export const RadioGroup = ({
  label,
  id,
  errors,
  disabled,
  options,
  ...props
}: RadioGroupProps) => {
  const { pending } = useFormStatus();

  return (
    <div className="space-y-2">
      {label && <Label htmlFor={id}>{label}</Label>}

      <SRadioGroup id={id} disabled={pending || disabled} {...props}>
        {options.map(({ value, label }) => (
          <Label
            key={value}
            className="flex items-center space-x-3 space-y-0 cursor-pointer"
          >
            <RadioGroupItem value={value} />
            <span className="font-semibold ">{label}</span>
          </Label>
        ))}
      </SRadioGroup>

      <FormErrors id={id} errors={errors} />
    </div>
  );
};
