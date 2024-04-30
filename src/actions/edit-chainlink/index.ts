"use server";

import { revalidatePath } from "next/cache";

import { createAction } from "@/lib/create-action";
import { server } from "@/lib/server-instance";
import { ChainlinkNode } from "@/types";
import { logger } from "@/lib/utils";

import { InputType, ReturnType } from "./types";
import { EditChainlinkNode } from "./schema";

const handler = async (values: InputType): Promise<ReturnType> => {
  let node;
  const { name, workspaceId, ...data } = values;
  try {
    const response = await server.put<ChainlinkNode>(
      `/chainlink/nodes/${name}?workspace_id=${workspaceId}`,
      data
    );
    node = response.data;
  } catch (error) {
    logger("EditChainLink", error);
    return { error: "Something went wrong." };
  }

  revalidatePath(`/${workspaceId}/deployments/chainlink/${node.name}`);
  return { data: node };
};

export const editChainlinkNode = createAction(EditChainlinkNode, handler);
