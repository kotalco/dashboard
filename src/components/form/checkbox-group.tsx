import { OptionType } from "@/types";

import { Checkbox, CheckboxProps } from "@/components/form/checkbox";
import { Label } from "@/components/ui/label";
import { FormErrors } from "@/components/form/form-errors";

interface CheckboxGroupProps extends CheckboxProps {
  options: OptionType[];
  label?: string;
  className?: string;
  defaultValues?: string[];
}

export const CheckboxGroup = ({
  options,
  label,
  className,
  errors,
  id,
  defaultValues,
  ...props
}: CheckboxGroupProps) => {
  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}
      <div className={className}>
        {options.map(({ value, label }) => (
          <Checkbox
            id={id}
            label={label}
            key={value}
            defaultChecked={defaultValues?.includes(value)}
            value={value}
            {...props}
          />
        ))}
      </div>
      <FormErrors id={id} errors={errors} />
    </div>
  );
};
