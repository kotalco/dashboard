import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { StorageItems } from "@/enums";
import { api } from "@/lib/axios";
import { Workspace } from "@/types";

export default async function SetupLayout({
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

  const workspaceId = cookies().get(StorageItems.LAST_WORKSPACE_ID);

  try {
    if (!workspaceId?.value) throw new Error("No workspace ID found");
    const { data: workspace } = await api.get<Workspace>(
      `/workspaces/${workspaceId?.value}`,
      config
    );
    redirect(`/${workspace.id}`);
  } catch (error) {
    const { data: workspaces } = await api.get<Workspace[]>(
      "/workspaces",
      config
    );

    redirect(`/${workspaces[0].id}`);
  }

  return <>{children}</>;
}
