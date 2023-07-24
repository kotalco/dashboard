"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAPIMessage } from "@/hooks/useAPIMessage";

export const APIMessage = () => {
  const { message, type } = useAPIMessage();

  if (!message) return null;

  return (
    <Alert variant={type.variant} className="text-center">
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
};
