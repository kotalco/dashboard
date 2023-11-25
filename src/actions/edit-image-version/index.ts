"use server";

import { revalidatePath } from "next/cache";

import { createAction } from "@/lib/create-action";
import { server } from "@/lib/server-instance";

import { InputType, ReturnType } from "./types";
import { EditImageVersion } from "./schema";

export const handler = async (
  data: InputType,
  identifiers: Record<string, string>
): Promise<ReturnType> => {
  let node;
  try {
    const response = await server.put(identifiers.url, data);
    node = response.data;
  } catch (error) {
    return { error: "Something went wrong." };
  }

  revalidatePath(identifiers.pathname);
  return { data: node };
};

export const editImageVersion = createAction(EditImageVersion, handler);
