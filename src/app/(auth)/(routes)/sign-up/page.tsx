import Link from "next/link";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RegisterForm } from "./components/register-form";

export default function Page() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center font-nunito">Sign In</CardTitle>
      </CardHeader>
      <CardContent>
        <RegisterForm />
      </CardContent>
      <CardFooter className="gap-x-1">
        Already have an account?
        <Link
          href="/sign-in"
          className="text-primary hover:underline underline-offset-4"
        >
          Login
        </Link>
      </CardFooter>
    </Card>
  );
}
