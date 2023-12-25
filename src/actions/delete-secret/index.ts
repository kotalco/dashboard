"use server";

import { revalidatePath } from "next/cache";

import { createAction } from "@/lib/create-action";
import { server } from "@/lib/server-instance";
import { logger } from "@/lib/utils";

import { APIInputType, APIReturnType } from "./types";
import { DeleteSecret } from "./schema";

const handler = async ({
  name,
  workspaceId,
}: APIInputType): Promise<APIReturnType> => {
  try {
    await server.delete(`/core/secrets/${name}`);
  } catch (error) {
    logger("DeleteSecret", error);
    return { error: "Something went wrong." };
  }

  revalidatePath(`/${workspaceId}/secrets}`);
  return { data: { message: "Secret deleted." } };
};

export const deleteSecret = createAction(DeleteSecret, handler);
