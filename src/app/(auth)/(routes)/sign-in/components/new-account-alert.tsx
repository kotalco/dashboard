import { cookies } from "next/headers";

import { StorageItems } from "@/enums";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export const NewAccountAlert = () => {
  const cookie = cookies().get(StorageItems.NEW_ACCOUNT);

  if (cookie?.value) {
    return (
      <div className="absolute top-10 inset-x-0 flex justify-center">
        <Alert className="mb-4 text-center max-w-3xl alert-success">
          <AlertTitle className="text-center">Account Created</AlertTitle>
          <AlertDescription>
            <p>
              You have been registered with{" "}
              <strong className="font-bold">{cookie.value}</strong>. Please
              check your inbox and confirm your email
            </p>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return null;
};
