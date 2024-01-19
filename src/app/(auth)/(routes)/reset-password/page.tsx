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
    <>
      <div className="text-center">
        <Heading variant="h2" title="Reset Password" />
      </div>
      <ResetPasswordForm />
    </>
  );
}
