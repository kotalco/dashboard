import { cookies } from "next/headers";

import { StorageItems } from "@/enums";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export const NewAccountAlert = () => {
  const cookie = cookies().get(StorageItems.NEW_ACCOUNT);

  if (cookie?.value) {
    return (
      <Alert className="mb-4 text-center alert-sccuess">
        <AlertTitle className="text-center">Account Created</AlertTitle>
        <AlertDescription>
          <p>
            You have been registered with{" "}
            <strong className="font-bold">{cookie.value}</strong>. Please check
            your inbox and confirm your email
          </p>
        </AlertDescription>
      </Alert>
    );
  }

  return null;
};
