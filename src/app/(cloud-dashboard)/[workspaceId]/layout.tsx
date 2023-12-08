import { redirect } from "next/navigation";

import { getWorkspace } from "@/services/get-workspace";

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { workspaceId: string };
}) {
  try {
    await getWorkspace(params.workspaceId);
  } catch (error) {
    redirect("/");
  }

  return <>{children}</>;
}
