import { notFound, redirect } from "next/navigation";

import { findUser } from "@/services/find-user";

export default async function PrivatePageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await findUser();

  // Make sure user is a customer
  if (!user?.is_customer) notFound();

  // No user and no auth token or invalid token
  if (!user) redirect("/sign-in");

  return <>{children}</>;
}
