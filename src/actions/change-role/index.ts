"use server";

import { revalidatePath } from "next/cache";

import { createAction } from "@/lib/create-action";
import { server } from "@/lib/server-instance";

import { InputType, ReturnType } from "./types";
import { ChangeRole } from "./schema";

const handler = async (
  data: InputType,
  idetifiers: { workspaceId: string; userId: string }
): Promise<ReturnType> => {
  try {
    await server.patch<{ message: string }>(
      `/workspaces/${idetifiers.workspaceId}/members/${idetifiers.userId}`,
      data
    );
  } catch (error) {
    return { error: "Something went wrong." };
  }

  revalidatePath(`/${idetifiers.workspaceId}/members`);
  return { data: { message: "User added" } };
};

export const changeRole = createAction(ChangeRole, handler);
