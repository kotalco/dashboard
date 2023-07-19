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

  try {
    await findUser();
  } catch (error) {
    return <>{children}</>;
  }

  const workspaceId = cookies().get(StorageItems.LAST_WORKSPACE_ID);
  if (workspaceId?.value) redirect(`/${workspaceId.value}`);

  const workspaces = await getWorkspaces();

  redirect(`/${workspaces[0].id}`);
}
