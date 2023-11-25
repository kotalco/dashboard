"use server";

import { revalidatePath } from "next/cache";

import { createAction } from "@/lib/create-action";
import { server } from "@/lib/server-instance";

import { APIInputType, APIReturnType } from "./types";

import { DeleteNode } from "./schema";
import { redirect } from "next/navigation";

const handler = async (
  _: APIInputType,
  identifiers: Record<string, string>
): Promise<APIReturnType> => {
  let data;
  try {
    await server.delete(identifiers.url);
    data = { message: "Node deleted." };
  } catch (error) {
    return { error: "Something went wrong." };
  }

  revalidatePath(identifiers.redirectUrl);
  return { data };
};

export const deleteNode = createAction(DeleteNode, handler);
