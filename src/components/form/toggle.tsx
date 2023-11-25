import { ComponentPropsWithoutRef } from "react";
import { useFormStatus } from "react-dom";

import { Root } from "@radix-ui/react-switch";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { FormErrors } from "@/components/form/form-errors";

interface ToggleProps extends ComponentPropsWithoutRef<typeof Root> {
  id: string;
  label?: string;
  errors?: Record<string, string[] | undefined>;
  description?: string | React.ReactNode;
}

export const Toggle = ({
  label,
  id,
  errors,
  description,
  disabled,
  ...props
}: ToggleProps) => {
  const { pending } = useFormStatus();

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        {label && (
          <Label htmlFor={id} className="font-semibold text-neutral-700">
            {label}
          </Label>
        )}

        <Switch disabled={pending || disabled} name={id} id={id} {...props} />
      </div>

      {typeof description === "string" ? (
        <p className="text-sm text-foreground">{description}</p>
      ) : (
        description
      )}

      <FormErrors id={id} errors={errors} />
    </div>
  );
};
