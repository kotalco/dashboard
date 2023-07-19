import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { StorageItems } from "@/enums";
import { api } from "@/lib/axios";

export default async function PrivatePageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = cookies().get(StorageItems.AUTH_TOKEN);
  if (!token?.value) redirect("/sign-in");

  const config = {
    headers: { Authorization: `Bearer ${token.value}` },
  };

  try {
    await api.get("/users/whoami", config);
  } catch (error) {
    redirect("/sign-in");
  }

  return <>{children}</>;
}
