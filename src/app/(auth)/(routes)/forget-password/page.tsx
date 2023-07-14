import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ForgetPasswordForm } from "./components/forget-password-form";

export default async function Page() {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-center font-nunito">
            Forget Password
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ForgetPasswordForm />
        </CardContent>
        <CardFooter>
          <Link
            href="/sign-in"
            className="flex text-primary hover:underline gap-x-1 underline-offset-4"
          >
            <ArrowLeft /> Back to Login
          </Link>
        </CardFooter>
      </Card>
    </>
  );
}
