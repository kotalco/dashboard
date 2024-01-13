"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { useAction } from "@/hooks/use-action";
import { resetPassword } from "@/actions/reset-password";

import { Input } from "@/components/form/input";
import { SubmitButton } from "@/components/form/submit-button";
import { SubmitSuccess } from "@/components/form/submit-success";
import { SubmitError } from "@/components/form/submit-error";

export const ResetPasswordForm = () => {
  const searchParams = useSearchParams();
  const { execute, fieldErrors, error, success } = useAction(resetPassword);

  const onSubmit = (formData: FormData) => {
    const email = searchParams.get("email") as string;
    const token = searchParams.get("token") as string;
    const password = formData.get("password") as string;
    const password_confirmation = formData.get(
      "password_confirmation"
    ) as string;

    execute({ email, token, password, password_confirmation });
  };

  return (
    <form action={onSubmit} className="space-y-4">
      <SubmitError error={error} />

      <SubmitSuccess success={success}>
        Congratulations, your email has been reset. You can now{" "}
        <Link
          href="/sign-ih"
          className="text-primary hover:underline underline-offset-4"
        >
          Login
        </Link>{" "}
        using your new password and enjoy our services.
      </SubmitSuccess>

      <Input
        id="password"
        label="Password"
        type="password"
        errors={fieldErrors}
      />

      <Input
        id="password_confirmation"
        label="Password Confirmation"
        type="password"
        errors={fieldErrors}
      />
      <SubmitButton className="w-full">Reset Password</SubmitButton>
    </form>
  );
};
