"use server";

import { revalidatePath } from "next/cache";

import { createAction } from "@/lib/create-action";
import { server } from "@/lib/server-instance";

import { InputType, ReturnType } from "./types";
import { EditAPI, EditAccessControl, EditLogs, EditNetworking } from "./schema";
import { ExecutionClientNode } from "@/types";

const handler = async (
  data: InputType,
  identifiers: Record<string, string>
): Promise<ReturnType> => {
  let node;
  try {
    const response = await server.put<ExecutionClientNode>(
      `/ethereum/nodes/${identifiers.name}`,
      data
    );
    node = response.data;
  } catch (error) {
    return { error: "Something went wrong." };
  }

  revalidatePath(
    `${identifiers.workspaceId}/deployments/ethereum/execution-clients/${node.name}`
  );
  return { data: node };
};

export const editAPI = createAction(EditAPI, handler);
export const editAccessControl = createAction(EditAccessControl, handler);
export const editLogs = createAction(EditLogs, handler);
export const editNetworking = createAction(EditNetworking, handler);
