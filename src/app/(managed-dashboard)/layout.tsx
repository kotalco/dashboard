import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";

import { findUser } from "@/services/find-user";

import { ManagedActions } from "@/components/shared/command-actions/managed-actions";

export default async function PrivatePageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await findUser();

  // No user and no auth token or invalid token
  if (!user) {
    const nextUrl = headers().get("x-pathname");
    redirect(`/sign-in?redirect=${nextUrl}`);
  }

  // Make sure user is a customer
  if (!user?.is_customer) notFound();

  return (
    <>
      <ManagedActions />
      {children}
    </>
  );
}
