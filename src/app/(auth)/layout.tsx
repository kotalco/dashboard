import { cookies } from "next/headers";

import { api } from "@/lib/axios";
import { StorageItems } from "@/enums";
import { WorksapcesList } from "@/types";
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
  if (workspaceId?.value) redirect(`/${workspaceId.value}`);

  const { data: workspaces } = await api.get<WorksapcesList>(
    "/workspaces",
    config
  );

  redirect(`/${workspaces[0].id}`);
}
