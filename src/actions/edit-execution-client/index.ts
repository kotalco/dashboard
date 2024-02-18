"use server";

import { revalidatePath } from "next/cache";

import { createAction } from "@/lib/create-action";
import { server } from "@/lib/server-instance";
import { logger } from "@/lib/utils";

import { InputType, ReturnType } from "./types";
import { EditExecutionClient } from "./schema";
import { ExecutionClientNode } from "@/types";

const handler = async (values: InputType): Promise<ReturnType> => {
  let node;
  const { workspaceId, name, ...data } = values;
  try {
    const response = await server.put<ExecutionClientNode>(
      `/ethereum/nodes/${name}?workspace_id=${workspaceId}`,
      data
    );
    node = response.data;
  } catch (error) {
    logger("EditExecutionClient", error);
    return { error: "Something went wrong." };
  }

  revalidatePath(
    `/${workspaceId}/deployments/ethereum/execution-clients/${node.name}`
  );
  return { data: node };
};

export const editExecutionClientNode = createAction(
  EditExecutionClient,
  handler
);
