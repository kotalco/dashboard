"use server";

import { isAxiosError } from "axios";
import { revalidatePath } from "next/cache";

import { createAction } from "@/lib/create-action";
import { server } from "@/lib/server-instance";
import { Workspace } from "@/types";

import { InputType, ReturnType } from "./types";
import { EditWorkspace } from "./schema";

const handler = async (
  data: InputType,
  identifiers: { workspaceId: string }
): Promise<ReturnType> => {
  let workspace;
  try {
    const response = await server.patch<Workspace>(
      `/workspaces/${identifiers.workspaceId}`,
      data
    );
    workspace = response.data;
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 409) {
      return { error: "Workspace name already exists." };
    }

    return { error: "Something went wrong." };
  }

  revalidatePath(`/${identifiers.workspaceId}/settings`);
  return { data: workspace };
};

export const editWorkspace = createAction(EditWorkspace, handler);
