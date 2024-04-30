import Link from "next/link";

import { CardWrapper } from "@/components/shared/auth/card-wrapper";

import { LoginForm } from "./components/login-form";
import { NewAccountAlert } from "./components/new-account-alert";
import { EmailVerifiedAlert } from "./components/email-verified-alert";

export default async function Page() {
  return (
    <>
      <NewAccountAlert />
      <EmailVerifiedAlert />

      <CardWrapper title="Sign In">
        <LoginForm />

        <p className="gap-x-1">
          Don&apos;t have an account?
          <Link
            href="/sign-up"
            className="underline ml-2 hover:text-muted-foreground"
          >
            Sign Up
          </Link>
        </p>
      </CardWrapper>
    </>
  );
}
