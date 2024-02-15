"use server";

import { revalidatePath } from "next/cache";

import { createAction } from "@/lib/create-action";
import { server } from "@/lib/server-instance";
import { NEARNode } from "@/types";
import { logger } from "@/lib/utils";

import { InputType, ReturnType } from "./types";
import { EditNearNode } from "./schema";

const handler = async (values: InputType): Promise<ReturnType> => {
  let node;
  const { name, workspaceId, ...data } = values;

  try {
    const response = await server.put<NEARNode>(
      `/near/nodes/${name}?workspace_id=${workspaceId}`,
      data
    );
    node = response.data;
  } catch (error) {
    logger("EditNEAR", error);
    return { error: "Something went wrong." };
  }

  revalidatePath(`/${workspaceId}/deployments/near/${node.name}`);
  return { data: node };
};

export const editNearNode = createAction(EditNearNode, handler);
