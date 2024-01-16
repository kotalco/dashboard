import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { StorageItems } from "@/enums";
import { findUser } from "@/services/find-user";
import { getWorkspaces } from "@/services/get-workspaces";
import { getWorkspace } from "@/services/get-workspace";
import { logger } from "@/lib/utils";

export default async function Page() {
  const { user } = await findUser();

  // No user and no auth token or invalid token
  if (!user) redirect("/sign-in");

  if (user.is_customer) redirect("/virtual-endpoints");

  const workspaceId = cookies().get(StorageItems.LAST_WORKSPACE_ID);
  if (workspaceId?.value) {
    try {
      const workspace = await getWorkspace(workspaceId.value);
      redirect(`/${workspace.id}`);
    } catch (error) {
      logger("GetWorkspaceByID", error);
      const workspaces = await getWorkspaces();
      if (workspaces.length) redirect(`/${workspaces[0].id}`);
    }
  }

  const workspaces = await getWorkspaces();
  if (workspaces.length) redirect(`/${workspaces[0].id}`);
}
