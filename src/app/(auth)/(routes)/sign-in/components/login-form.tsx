"use client";

import Link from "next/link";
import { useState } from "react";

import { loginUser } from "@/actions/login";
import { useAction } from "@/hooks/use-action";

import { Input } from "@/components/form/input";
import { Checkbox } from "@/components/form/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Verification2FAModal } from "@/components/modals/verification-2fa-modal";
import { SubmitError } from "@/components/form/submit-error";
import { SubmitButton } from "@/components/form/submit-button";

import { ReverifyEmailALert } from "./reverify-email-alert";

export const LoginForm = () => {
  const [email, setEmail] = useState<string>();
  const [open, setOpen] = useState(false);
  const { execute, error, fieldErrors } = useAction(loginUser, {
    onSuccess: (data) => {
      if ("Authorized" in data) {
        setOpen(true);
      }

      if ("email" in data) {
        setEmail(data.email);
      }
    },
  });

  const onSubmit = (formData: FormData) => {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const remember_me = formData.get("remember_me") === "on";

    execute({ email, password, remember_me });
  };

  return (
    <>
      <Verification2FAModal isOpen={open} onClose={() => setOpen(false)} />
      <form action={onSubmit} className="space-y-4">
        <Input id="email" label="Email Address" errors={fieldErrors} />

        <Input
          id="password"
          label="Password"
          errors={fieldErrors}
          type="password"
        />

        <div className="flex justify-between">
          <Checkbox id="remember-me" label="Remember Me" errors={fieldErrors} />
          <div className="text-sm whitespace-nowrap">
            <Link
              href="/forget-password"
              className="text-primary hover:underline underline-offset-4"
            >
              Forgot your password?
            </Link>
          </div>
        </div>

        <SubmitError error={error} />

        <SubmitButton className="w-full">Login</SubmitButton>
      </form>
      {email && <ReverifyEmailALert email={email} />}
    </>
  );
};
