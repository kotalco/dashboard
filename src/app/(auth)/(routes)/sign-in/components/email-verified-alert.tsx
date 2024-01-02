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
      <Alert className="mb-4 alert-sccuess">
        <AlertDescription>
          Your email has been verified. You can now login and enjoy our
          services.
        </AlertDescription>
      </Alert>
    );
  }

  return <FailedVerificationAlert email={email} status={status} />;
};
