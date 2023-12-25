"use server";

import { revalidatePath } from "next/cache";

import { createAction } from "@/lib/create-action";
import { server } from "@/lib/server-instance";
import { StacksNode } from "@/types";
import { logger } from "@/lib/utils";

import { InputType, ReturnType } from "./types";
import { EditAPI, EditBitcoin, EditMining, EditNetworking } from "./schema";

const handler = async (
  data: InputType,
  identifiers: Record<string, string>
): Promise<ReturnType> => {
  let node;
  try {
    const response = await server.put<StacksNode>(
      `/stacks/nodes/${identifiers.name}`,
      data
    );
    node = response.data;
  } catch (error) {
    logger("EditStacks", error);
    return { error: "Something went wrong." };
  }

  revalidatePath(`/${identifiers.workspaceId}/deployments/stacks/${node.name}`);
  return { data: node };
};

export const editAPI = createAction(EditAPI, handler);
export const editBitcoin = createAction(EditBitcoin, handler);
export const editMining = createAction(EditMining, handler);
export const editNetworking = createAction(EditNetworking, handler);
