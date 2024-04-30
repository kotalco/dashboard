"use client";

import { usePathname } from "next/navigation";

import { useAction } from "@/hooks/use-action";
import { changePassword } from "@/actions/change-password";

import { Input } from "@/components/form/input";
import { SubmitError } from "@/components/form/submit-error";
import { SubmitSuccess } from "@/components/form/submit-success";
import { SubmitButton } from "@/components/form/submit-button";

export const ChangePasswordForm = () => {
  const pathname = usePathname();
  const { execute, error, fieldErrors, success } = useAction(changePassword);

  const onSubmit = (formData: FormData) => {
    const old_password = formData.get("old_password") as string;
    const password = formData.get("password") as string;
    const password_confirmation = formData.get(
      "password_confirmation"
    ) as string;

    execute({ old_password, password, password_confirmation }, { pathname });
  };

  return (
    <form action={onSubmit} className="space-y-4">
      <Input
        id="old_password"
        label="Current Password"
        errors={fieldErrors}
        type="password"
      />
      <Input
        id="password"
        label="New Password"
        errors={fieldErrors}
        type="password"
      />
      <Input
        id="password_confirmation"
        label="Confirm Password"
        errors={fieldErrors}
        type="password"
      />

      <SubmitButton>Update Password</SubmitButton>

      <SubmitSuccess success={success}>
        Your password has been changed, you can now use your new password to
        login.
      </SubmitSuccess>

      <SubmitError error={error} />
    </form>
  );
};
