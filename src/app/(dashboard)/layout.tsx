import { redirect } from "next/navigation";

import { findUser } from "@/services/find-user";

export default async function PrivatePageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, error } = await findUser();

  // No user and Invalid Subscription
  if (!user && error?.response?.data.name === "INVALID_SUBSCRIPTION")
    redirect("/");

  // No user and Subscription Conflict
  if (!user && error?.response?.data.name === "Conflict") redirect("/");

  // No user and no auth token or invalid token
  if (!user) redirect("/sign-in");

  return <>{children}</>;
}
