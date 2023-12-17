import Link from "next/link";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { LoginForm } from "./components/login-form";
import { NewAccountAlert } from "./components/new-account-alert";
import { EmailVerifiedAlert } from "./components/email-verified-alert";

export default async function Page() {
  return (
    <>
      <NewAccountAlert />
      <EmailVerifiedAlert />
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Sign In</CardTitle>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
        <CardFooter className="gap-x-1">
          Don&apos;t have an account?
          <Link
            href="/sign-up"
            className="text-primary hover:underline underline-offset-4"
          >
            Sign Up
          </Link>
        </CardFooter>
      </Card>
    </>
  );
}
