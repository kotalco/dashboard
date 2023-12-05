"use client";

import { useAction } from "@/hooks/use-action";
import { forgotPassword } from "@/actions/forgot-password";

import { Input } from "@/components/form/input";
import { SubmitButton } from "@/components/form/submit-button";
import { SubmitSuccess } from "@/components/form/submit-success";
import { SubmitError } from "@/components/form/submit-error";

export const ForgetPasswordForm = () => {
  const { execute, error, success, fieldErrors } = useAction(forgotPassword);

  const onSubmit = (formData: FormData) => {
    const email = formData.get("email") as string;

    execute({ email });
  };

  return (
    <form action={onSubmit} className="space-y-4">
      <Input id="email" label="Email Address" errors={fieldErrors} />

      <SubmitButton className="w-full">Send Reset Email</SubmitButton>

      <SubmitSuccess success={success}>
        Reset password email has been sent to your email. Please check your mail
        to continue.
      </SubmitSuccess>

      <SubmitError error={error} />
    </form>
  );
};
