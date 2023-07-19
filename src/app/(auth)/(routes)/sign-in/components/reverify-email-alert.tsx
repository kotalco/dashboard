import { useState } from "react";
import { UseFormSetError } from "react-hook-form";
import { isAxiosError } from "axios";
import { Loader2 } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { client } from "@/lib/client-instance";

export const ReverifyEmailALert = ({
  email,
  setError,
}: {
  email?: string;
  setError: UseFormSetError<{}>;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function reactivateEmail() {
    try {
      setIsLoading(true);
      setSuccess(false);

      await client.post("/users/resend_email_verification", {
        email,
      });

      setSuccess(true);
    } catch (error) {
      if (isAxiosError(error)) {
        const { response } = error;

        if (response?.status === 400) {
          return setError("root", {
            type: response?.status.toString(),
            message: "Email already verified.",
          });
        }

        if (response?.status === 404) {
          return setError("root", {
            type: response?.status.toString(),
            message:
              "Email not found. Sign up and a verification email will be sent automatically.",
          });
        }

        return setError("root", {
          type: response?.status.toString(),
          message: "Something went wrong.",
        });
      }
    } finally {
      setIsLoading(false);
    }
  }

  if (!email) return null;

  if (success) {
    return (
      <Alert variant="success">
        <AlertDescription>
          Verification email has been sent. Please check your email.
        </AlertDescription>
      </Alert>
    );
  }

  if (isLoading)
    return (
      <div className="flex justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );

  return (
    <Alert variant="destructive">
      <AlertDescription>
        <span>Email not verified. Resend Activation Email? Click </span>
        <Button
          variant="link"
          type="button"
          onClick={reactivateEmail}
          className="px-0"
        >
          here
        </Button>
        .
      </AlertDescription>
    </Alert>
  );
};
