"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useIsMounted } from "@/hooks/useIsMounted";
import { LocalStorageItems } from "@/enums";

export const NewAccountAlert = () => {
  const mounted = useIsMounted();

  if (!mounted) return null;

  const email = localStorage.getItem(LocalStorageItems.NEW_ACCOUNT);
  localStorage.removeItem(LocalStorageItems.NEW_ACCOUNT);

  if (email) {
    return (
      <Alert variant="success" className="mb-4">
        <AlertTitle className="text-center">Account Created</AlertTitle>
        <AlertDescription>
          <p>
            You have been registered with{" "}
            <strong className="font-bold">{email}</strong>. Please check your
            inbox and confirm your email
          </p>
        </AlertDescription>
      </Alert>
    );
  }

  return null;
};
