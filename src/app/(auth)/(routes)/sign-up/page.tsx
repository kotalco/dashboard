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
      <CardFooter>
        <p>
          <span>Already have an account? </span>
          <Link
            href="/sign-in"
            className="font-medium text-primary/80 hover:text-primary"
          >
            Login
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
