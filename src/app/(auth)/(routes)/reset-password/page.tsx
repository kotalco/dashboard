import { ResetPasswordForm } from "./components/reset-password-form";
import { redirect } from "next/navigation";
import { Heading } from "@/components/ui/heading";

export default async function Page({
  searchParams,
}: {
  searchParams: { token: string; email: string };
}) {
  if (!searchParams.token || !searchParams.email) {
    redirect("/");
  }

  return (
    <div className="space-y-8">
      <Heading title="Reset Password" />
      <ResetPasswordForm />
    </div>
  );
}
