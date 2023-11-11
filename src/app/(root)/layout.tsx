import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { StorageItems } from "@/enums";
import { findUser } from "@/services/find-user";
import { getWorkspaces } from "@/services/get-workspaces";

export default async function SetupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, error } = await findUser();
  // No user and Invalid Subscription
  if (!user && error?.response?.data.name === "INVALID_SUBSCRIPTION")
    return <>{children}</>;

  // No user and Subscription Conflict
  if (!user && error?.response?.data.name === "Conflict")
    return <>{children}</>;

  // No user and no auth token or invalid token
  if (!user) redirect("/sign-in");

  const workspaceId = cookies().get(StorageItems.LAST_WORKSPACE_ID);
  if (workspaceId?.value) redirect(`/${workspaceId.value}`);

  const workspaces = await getWorkspaces();
  if (workspaces.length) redirect(`/${workspaces[0].id}`);
}
