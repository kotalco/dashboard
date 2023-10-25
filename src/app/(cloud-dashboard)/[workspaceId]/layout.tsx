import { findUser } from "@/services/find-user";
import { getWorkspace } from "@/services/get-workspace";
import { getWorkspaces } from "@/services/get-workspaces";
import { notFound, redirect } from "next/navigation";

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { workspaceId: string };
}) {
  const { user } = await findUser();

  if (user?.is_customer) notFound();

  try {
    await getWorkspace(params.workspaceId);
  } catch (error) {
    const workspaces = await getWorkspaces();
    redirect(`/${workspaces[0].id}`);
  }

  return <>{children}</>;
}
