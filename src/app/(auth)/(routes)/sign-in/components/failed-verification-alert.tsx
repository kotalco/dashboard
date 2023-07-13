"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { isAxiosError } from "axios";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/axios";

interface FailedVerificationAlertProps {
  email: string;
  status: string;
}

export const FailedVerificationAlert: React.FC<
  FailedVerificationAlertProps
> = ({ email, status }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  async function resendVerificationEmail() {
    try {
      setIsLoading(true);
      setIsSuccess(false);

      await api.post("/users/resend_email_verification", {
        email,
      });

      setIsSuccess(true);
    } catch (error) {
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading)
    return (
      <div className="flex justify-center mb-4">
        <Loader2 className="animate-spin" />
      </div>
    );

  if (isSuccess)
    return (
      <Alert variant="success" className="mb-4">
        <AlertDescription>
          Verification email has been sent. Please check your email.
        </AlertDescription>
      </Alert>
    );

  if (status === "401") {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertDescription>
          <span>This verification email is already expired. Please click </span>
          <Button
            variant="link"
            type="button"
            onClick={resendVerificationEmail}
            className="px-0"
          >
            here
          </Button>
          <span> to resend another one.</span>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert variant="destructive" className="mb-4">
      <AlertDescription>
        <span>Verification failed. Please click </span>
        <Button
          variant="link"
          type="button"
          onClick={resendVerificationEmail}
          className="px-0"
        >
          here
        </Button>
        <span> to resend another verification email.</span>
      </AlertDescription>
    </Alert>
  );
};
