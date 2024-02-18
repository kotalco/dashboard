"use client";

import { useAction } from "@/hooks/use-action";
import { registerUser } from "@/actions/register-user";

import { Input } from "@/components/form/input";
import { SubmitButton } from "@/components/form/submit-button";
import { SubmitError } from "@/components/form/submit-error";

export const RegisterForm = () => {
  const { execute, fieldErrors, error } = useAction(registerUser);

  const onSubmit = (formData: FormData) => {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const password_confirmation = formData.get(
      "password_confirmation"
    ) as string;

    execute({ email, password, password_confirmation });
  };

  return (
    <form action={onSubmit} className="space-y-4">
      <SubmitError error={error} />

      <Input id="email" label="Email Address" errors={fieldErrors} />

      <Input
        id="password"
        label="Password"
        errors={fieldErrors}
        type="password"
      />

      <Input
        id="password_confirmation"
        label="Password Confirmation"
        errors={fieldErrors}
        type="password"
      />

      <SubmitButton className="w-full">Sign Up</SubmitButton>
    </form>
  );
};
