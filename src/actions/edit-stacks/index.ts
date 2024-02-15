"use server";

import { revalidatePath } from "next/cache";

import { createAction } from "@/lib/create-action";
import { server } from "@/lib/server-instance";
import { StacksNode } from "@/types";
import { logger } from "@/lib/utils";

import { InputType, ReturnType } from "./types";
import { EditStacks } from "./schema";

const handler = async (values: InputType): Promise<ReturnType> => {
  let node;
  const { name, workspaceId, ...data } = values;
  try {
    const response = await server.put<StacksNode>(
      `/stacks/nodes/${name}?workspace_id=${workspaceId}`,
      data
    );
    node = response.data;
  } catch (error) {
    logger("EditStacks", error);
    return { error: "Something went wrong." };
  }

  revalidatePath(`/${workspaceId}/deployments/stacks/${node.name}`);
  return { data: node };
};

export const editStacksNode = createAction(EditStacks, handler);
