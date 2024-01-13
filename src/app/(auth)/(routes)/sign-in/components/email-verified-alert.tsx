import { cookies } from "next/headers";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { StorageItems } from "@/enums";
import { FailedVerificationAlert } from "./failed-verification-alert";

export const EmailVerifiedAlert = () => {
  const cookie = cookies().get(StorageItems.EMAIL_VERIFIED);

  if (!cookie) return null;

  const [email, status] = cookie.value.split(",");

  if (status === "200") {
    return (
      <div className="absolute top-10 inset-x-0 flex justify-center">
        <Alert className="mb-4 text-center max-w-3xl alert-success">
          <AlertDescription>
            Your email has been verified. You can now login and enjoy our
            services.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return <FailedVerificationAlert email={email} status={status} />;
};
