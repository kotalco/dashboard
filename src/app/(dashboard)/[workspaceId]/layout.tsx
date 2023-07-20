import { getWorkspace } from "@/services/get-workspace";
import { getWorkspaces } from "@/services/get-workspaces";
import { redirect } from "next/navigation";

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
    const workspaces = await getWorkspaces();
    redirect(`/${workspaces[0].id}`);
  }

  return <>{children}</>;
}
