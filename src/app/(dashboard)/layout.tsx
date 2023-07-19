import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { StorageItems } from "@/enums";
import { findUser } from "@/services/find-user";

export default async function PrivatePageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = cookies().get(StorageItems.AUTH_TOKEN);
  if (!token?.value) redirect("/sign-in");

  try {
    await findUser();
  } catch (error) {
    redirect("/sign-in");
  }

  return <>{children}</>;
}
