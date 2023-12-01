import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResetPasswordForm } from "./components/reset-password-form";
import { redirect } from "next/navigation";

export default async function Page({
  searchParams,
}: {
  searchParams: { token: string; email: string };
}) {
  if (!searchParams.token || !searchParams.email) {
    redirect("/");
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Reset Password</CardTitle>
        </CardHeader>
        <CardContent>
          <ResetPasswordForm />
        </CardContent>
      </Card>
    </>
  );
}
