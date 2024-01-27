"use client";

import { useFormStatus } from "react-dom";
import { PropsWithChildren } from "react";

import { Button, ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export const SubmitButton: React.FC<PropsWithChildren<ButtonProps>> = ({
  children,
  disabled,
  className,
  variant,
  ...props
}) => {
  const { pending } = useFormStatus();

  return (
    <Button
      disabled={pending || disabled}
      type="submit"
      className={cn(className, variant === "link" ? "" : "min-w-[100px]")}
      variant={variant}
      {...props}
    >
      {pending && variant !== "link" && (
        <Loader2 className={cn("w-4 h-4 mr-2 animate-spin")} />
      )}
      {children}
    </Button>
  );
};
