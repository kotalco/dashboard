import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { StorageItems } from "@/enums";
import { api } from "@/lib/axios";
import { WorksapcesList, Workspace } from "@/types";

export default async function SetupLayout() {
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
  if (workspaceId?.value) redirect(`/${workspaceId.value}`);

  const { data: workspaces } = await api.get<WorksapcesList>(
    "/workspaces",
    config
  );
  redirect(`/${workspaces[0].id}`);
}
