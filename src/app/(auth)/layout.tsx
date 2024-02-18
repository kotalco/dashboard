import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { StorageItems } from "@/enums";
import { findUser } from "@/services/find-user";
import { getWorkspaces } from "@/services/get-workspaces";

export default async function PublicPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = cookies().get(StorageItems.AUTH_TOKEN);
  if (!token?.value) return <>{children}</>;

  const { user, error } = await findUser();

  // No user and no auth token or invalid token
  if (!user) return <>{children}</>;

  if (user && user.is_customer) redirect("/virtual-endpoints");

  const workspaceId = cookies().get(StorageItems.LAST_WORKSPACE_ID);
  if (workspaceId?.value) redirect(`/${workspaceId.value}`);

  const workspaces = await getWorkspaces();

  redirect(`/${workspaces[0].id}`);
}
