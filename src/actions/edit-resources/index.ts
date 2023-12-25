"use server";

import { revalidatePath } from "next/cache";

import { createAction } from "@/lib/create-action";
import { server } from "@/lib/server-instance";
import { logger } from "@/lib/utils";

import { InputType, ReturnType } from "./types";
import { EditResources } from "./schema";

export const handler = async (
  data: InputType,
  identifiers: Record<string, string>
): Promise<ReturnType> => {
  let node;
  try {
    const response = await server.put(identifiers.url, data);
    node = response.data;
  } catch (error) {
    logger("EditRescourcesForDeployment", error);
    return { error: "Something went wrong." };
  }

  revalidatePath(identifiers.pathname);
  return { data: node };
};

export const editResources = createAction(EditResources, handler);
