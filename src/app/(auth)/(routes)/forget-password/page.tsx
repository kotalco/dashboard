import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { ForgetPasswordForm } from "./components/forget-password-form";
import { Heading } from "@/components/ui/heading";

export default async function Page() {
  return (
    <>
      <div className="text-center">
        <Heading variant="h2" title="Forget Password" />
      </div>

      <ForgetPasswordForm />
      <div>
        <Link href="/sign-in" className="underline hover:text-muted-foreground">
          <ArrowLeft className="inline-block w-4 h-4 mr-2" />
          Back to Login
        </Link>
      </div>
    </>
  );
}
