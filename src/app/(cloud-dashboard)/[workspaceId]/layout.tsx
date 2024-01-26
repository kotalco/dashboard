import { notFound, redirect } from "next/navigation";

import { findUser } from "@/services/find-user";

import { CloudActions } from "@/components/shared/command-actions/cloud-actions";

export default async function PrivatePageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await findUser();

  // No user and no auth token or invalid token
  if (!user) redirect("/sign-in");

  // Make sure user is a customer
  if (user.is_customer) notFound();

  return (
    <>
      <CloudActions />
      {children}
    </>
  );
}
