"use server";

import { revalidatePath } from "next/cache";

import { createAction } from "@/lib/create-action";
import { server } from "@/lib/server-instance";
import { BeaconNode } from "@/types";

import { InputType, ReturnType } from "./types";
import { EditAPI, EditCheckpointSync, EditExecutionClient } from "./schema";

const handler = async (
  data: InputType,
  identifiers: Record<string, string>
): Promise<ReturnType> => {
  let node;
  try {
    const response = await server.put<BeaconNode>(
      `/ethereum2/beaconnodes/${identifiers.name}`,
      data
    );
    node = response.data;
  } catch (error) {
    return { error: "Something went wrong." };
  }

  revalidatePath(
    `/${identifiers.workspaceId}/deployments/ethereum/beacon-nodes/${node.name}`
  );
  return { data: node };
};

export const editAPI = createAction(EditAPI, handler);
export const editCheckpointSync = createAction(EditCheckpointSync, handler);
export const edeitExecutionClient = createAction(EditExecutionClient, handler);
