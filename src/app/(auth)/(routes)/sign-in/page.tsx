import Link from "next/link";
import { cookies } from "next/headers";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LoginForm } from "./components/login-form";
import { NewAccountAlert } from "./components/new-account-alert";

export default async function Page() {
  return (
    <>
      <NewAccountAlert />

      <Card>
        <CardHeader>
          <CardTitle className="text-center font-nunito">Sign In</CardTitle>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
        <CardFooter>
          <p className="flex space-x-1">
            <span>Don&apos;t have an account?</span>
            <Link
              href="/sign-up"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Sign Up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </>
  );
}
