"use server";

import { revalidatePath } from "next/cache";

import { createAction } from "@/lib/create-action";
import { server } from "@/lib/server-instance";

import { APIInputType, APIReturnType } from "./types";

import { RemoveMemeber } from "./schema";

const handler = async ({
  id,
  workspaceId,
}: APIInputType): Promise<APIReturnType> => {
  try {
    await server.delete(`/workspaces/${workspaceId}/members/${id}`);
  } catch (error) {
    return { error: "Something went wrong." };
  }

  revalidatePath(`/${workspaceId}/members}`);
  return { data: { message: "Team member removed." } };
};

export const removeUser = createAction(RemoveMemeber, handler);
