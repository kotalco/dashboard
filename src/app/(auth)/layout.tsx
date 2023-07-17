import { cookies } from "next/headers";

import { Logo } from "@/components/logo";
import { api } from "@/lib/axios";
import { StorageItems } from "@/enums";
import { Workspace } from "@/types";
import { redirect } from "next/navigation";

export default async function PublicPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = cookies().get(StorageItems.AUTH_TOKEN);

  if (!token?.value) return <>{children}</>;

  const config = {
    headers: { Authorization: `Bearer ${token.value}` },
  };

  try {
    await api.get("/users/whoami", config);
  } catch (error) {
    return <>{children}</>;
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
}
