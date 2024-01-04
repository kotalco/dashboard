import React, { ComponentPropsWithoutRef, useId } from "react";
import { useFormStatus } from "react-dom";
import { Root } from "@radix-ui/react-checkbox";

import { Checkbox as SCheckbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { FormErrors } from "@/components/form/form-errors";

export interface CheckboxProps extends ComponentPropsWithoutRef<typeof Root> {
  id: string;
  label?: string;
  errors?: Record<string, string[] | undefined>;
}

export const Checkbox = ({
  disabled,
  label,
  id,
  errors,
  ...props
}: CheckboxProps) => {
  const { pending } = useFormStatus();
  const labelId = useId();

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <SCheckbox
          disabled={pending || disabled}
          name={id}
          id={labelId}
          {...props}
        />
        {label && (
          <Label htmlFor={labelId} className="font-semibold ">
            {label}
          </Label>
        )}
      </div>

      <FormErrors id={id} errors={errors} />
    </div>
  );
};
