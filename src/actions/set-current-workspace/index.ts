"use server";

import { StorageItems } from "@/enums";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const setCurrentWorkspace = (workspaceId: string, pathname: string) => {
  const segments = pathname.split("/");
  segments[1] = workspaceId;
  const route = segments.join("/");
  cookies().set(StorageItems.LAST_WORKSPACE_ID, workspaceId);
  revalidatePath("/");
  redirect(route);
};
