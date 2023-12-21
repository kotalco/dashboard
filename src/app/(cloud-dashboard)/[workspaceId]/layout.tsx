import { redirect } from "next/navigation";

import { getWorkspace } from "@/services/get-workspace";
import { logger } from "@/lib/utils";

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
    logger("GetWorkspaceByID", error);
    redirect("/");
  }

  return <>{children}</>;
}
