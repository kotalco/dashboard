import { useAction } from "@/hooks/use-action";
import { reverifyEmail } from "@/actions/reveify-email";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { SubmitSuccess } from "@/components/form/submit-success";
import { SubmitButton } from "@/components/form/submit-button";
import { SubmitError } from "@/components/form/submit-error";

export const ReverifyEmailALert = ({ email }: { email: string }) => {
  const { execute, error, success } = useAction(reverifyEmail);

  const onSubmit = () => {
    execute({ email });
  };

  if (!email) return null;

  if (success) {
    return (
      <div className="mt-5">
        <SubmitSuccess success={success}>
          Verification email has been sent. Please check your email.
        </SubmitSuccess>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-5">
        <SubmitError error={error} />
      </div>
    );
  }

  return (
    <Alert variant="destructive" className="mt-5">
      <AlertDescription>
        <span>Email not verified. Resend Activation Email? Click </span>
        <form action={onSubmit} className="inline">
          <SubmitButton variant="link" className="px-0">
            here
          </SubmitButton>
        </form>
        .
      </AlertDescription>
    </Alert>
  );
};
