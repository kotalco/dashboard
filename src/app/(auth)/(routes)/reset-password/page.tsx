import { redirect } from "next/navigation";

import { CardWrapper } from "@/components/shared/auth/card-wrapper";

import { ResetPasswordForm } from "./components/reset-password-form";

export default async function Page({
  searchParams,
}: {
  searchParams: { token: string; email: string };
}) {
  if (!searchParams.token || !searchParams.email) {
    redirect("/");
  }

  return (
    <CardWrapper title="Reset Password">
      <ResetPasswordForm />
    </CardWrapper>
  );
}
