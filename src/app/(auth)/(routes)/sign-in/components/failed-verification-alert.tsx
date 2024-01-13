"use client";

import { useAction } from "@/hooks/use-action";
import { reverifyEmail } from "@/actions/reveify-email";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { SubmitButton } from "@/components/form/submit-button";
import { SubmitError } from "@/components/form/submit-error";
import { SubmitSuccess } from "@/components/form/submit-success";

interface FailedVerificationAlertProps {
  email: string;
  status: string;
}

export const FailedVerificationAlert: React.FC<
  FailedVerificationAlertProps
> = ({ email, status }) => {
  const { execute, error, success } = useAction(reverifyEmail);

  const onSubmit = () => {
    execute({ email });
  };

  if (success)
    return (
      <div className="absolute top-10 inset-x-0 flex justify-center">
        <SubmitSuccess success={true}>
          Verification email has been sent. Please check your email.
        </SubmitSuccess>
      </div>
    );

  if (error) {
    return (
      <div className="absolute top-10 inset-x-0 flex justify-center">
        <SubmitError error={error} />
      </div>
    );
  }

  if (status === "401") {
    return (
      <div className="absolute top-10 inset-x-0 flex justify-center">
        <Alert variant="destructive" className="max-w-3xl text-center">
          <AlertDescription>
            <span>
              This verification email is already expired. Please click{" "}
            </span>
            <form className="inline" action={onSubmit}>
              <SubmitButton variant="link" className="p-0">
                here
              </SubmitButton>
            </form>

            <span> to resend another one.</span>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="absolute top-10 inset-x-0 flex justify-center">
      <Alert variant="destructive" className="max-w-3xl text-center">
        <AlertDescription>
          <span>Verification failed. Please click </span>
          <form className="inline" action={onSubmit}>
            <SubmitButton variant="link" className="px-0">
              here
            </SubmitButton>
          </form>

          <span> to resend another verification email.</span>
        </AlertDescription>
      </Alert>
    </div>
  );
};
