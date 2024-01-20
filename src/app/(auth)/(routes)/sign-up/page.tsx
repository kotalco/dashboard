import Link from "next/link";

import { CardWrapper } from "@/components/shared/auth/card-wrapper";

import { RegisterForm } from "./components/register-form";

export default function Page() {
  return (
    <CardWrapper title="Sign Up">
      <RegisterForm />
      <p className="gap-x-1">
        Already have an account?
        <Link
          href="/sign-in"
          className="underline ml-2 hover:text-muted-foreground"
        >
          Login
        </Link>
      </p>
    </CardWrapper>
  );
}
