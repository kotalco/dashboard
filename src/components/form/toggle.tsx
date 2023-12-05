import { ComponentPropsWithoutRef } from "react";
import { useFormStatus } from "react-dom";
import { Root } from "@radix-ui/react-switch";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { FormErrors } from "@/components/form/form-errors";
import { FormDescription } from "@/components/form/form-description";

import { cn } from "@/lib/utils";

interface ToggleProps extends ComponentPropsWithoutRef<typeof Root> {
  id: string;
  label?: string;
  errors?: Record<string, string[] | undefined>;
  description?: string | React.ReactNode;
  labelPosition?: "left" | "right";
}

export const Toggle = ({
  label,
  id,
  errors,
  description,
  disabled,
  className,
  labelPosition = "left",
  ...props
}: ToggleProps) => {
  const { pending } = useFormStatus();

  return (
    <div className="space-y-2">
      <div className={cn("flex items-center space-x-2", className)}>
        {label && labelPosition === "left" && (
          <Label htmlFor={id} className="font-semibold text-neutral-700">
            {label}
          </Label>
        )}

        <Switch disabled={pending || disabled} name={id} id={id} {...props} />

        {label && labelPosition === "right" && (
          <Label htmlFor={id} className="font-semibold text-neutral-700">
            {label}
          </Label>
        )}
      </div>

      <FormDescription description={description} />

      <FormErrors id={id} errors={errors} />
    </div>
  );
};
