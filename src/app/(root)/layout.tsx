import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function SetupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const token = cookies().get("auth_token");

  // if (!token) redirect("/sign-in");

  return <>{children}</>;
}
