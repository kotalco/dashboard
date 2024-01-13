import Link from "next/link";

import { RegisterForm } from "./components/register-form";
import { Heading } from "@/components/ui/heading";

export default function Page() {
  return (
    <div className="space-y-8">
      <Heading title="Sign Up" />

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
    </div>
  );
}
