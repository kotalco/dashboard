import Link from "next/link";

import { LoginForm } from "./components/login-form";
import { NewAccountAlert } from "./components/new-account-alert";
import { EmailVerifiedAlert } from "./components/email-verified-alert";
import { Heading } from "@/components/ui/heading";

export default async function Page() {
  return (
    <>
      <NewAccountAlert />
      <EmailVerifiedAlert />

      <div className="text-center">
        <Heading variant="h2" title="Sign In" />
      </div>

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
    </>
  );
}
