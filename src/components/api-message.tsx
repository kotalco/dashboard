"use client";

import { useAPIMessage } from "@/hooks/useAPIMessage";
import { cn } from "@/lib/utils";

import { Alert, AlertDescription } from "@/components/ui/alert";

export const APIMessage = () => {
  const { message, variant } = useAPIMessage();

  if (!message) return null;

  return (
    <Alert
      variant={variant === "destructive" ? "destructive" : null}
      className={cn("text-center", variant === "success" && "alert-success")}
    >
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
};
