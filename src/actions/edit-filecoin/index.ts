"use server";

import { revalidatePath } from "next/cache";

import { createAction } from "@/lib/create-action";
import { server } from "@/lib/server-instance";
import { FilecoinNode } from "@/types";

import { InputType, ReturnType } from "./types";
import { EditAPI, EditIPFS, EditLogging } from "./schema";

const handler = async (
  data: InputType,
  identifiers: Record<string, string>
): Promise<ReturnType> => {
  let node;
  try {
    const response = await server.put<FilecoinNode>(
      `/filecoin/nodes/${identifiers.name}`,
      data
    );
    node = response.data;
  } catch (error) {
    return { error: "Something went wrong." };
  }

  revalidatePath(
    `/${identifiers.workspaceId}/deployments/filecoin/${node.name}`
  );
  return { data: node };
};

export const editAPI = createAction(EditAPI, handler);
export const editIPFS = createAction(EditIPFS, handler);
export const editLogging = createAction(EditLogging, handler);
