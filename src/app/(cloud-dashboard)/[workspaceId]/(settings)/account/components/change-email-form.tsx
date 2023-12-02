"use client";

import { usePathname } from "next/navigation";

import { changeEmail } from "@/actions/change-email";
import { useAction } from "@/hooks/use-action";

import { Input } from "@/components/form/input";
import { SubmitButton } from "@/components/form/submit-button";
import { SubmitSuccess } from "@/components/form/submit-success";
import { SubmitError } from "@/components/form/submit-error";

interface ChangeEmailFormProps {
  email: string;
}

export const ChangeEmailForm: React.FC<ChangeEmailFormProps> = ({ email }) => {
  const pathname = usePathname();
  const { execute, fieldErrors, error, success } = useAction(changeEmail);

  const onSubmit = (formData: FormData) => {
    const newEmail = formData.get("email") as string;
    const password = formData.get("password") as string;
    console.log({ email: newEmail, password, oldEmail: email });
    execute({ email: newEmail, password, oldEmail: email }, { pathname });
  };

  return (
    <form action={onSubmit} className="space-y-4">
      <Input id="email" label="New Email Address" errors={fieldErrors} />
      <Input
        id="password"
        label="Current Password"
        type="password"
        errors={fieldErrors}
      />

      <SubmitSuccess success={success}>
        Your email address has been changed, you can now use your new email to
        login.
      </SubmitSuccess>

      <SubmitError error={error} />

      <SubmitButton>Update Email</SubmitButton>
    </form>
  );
};
