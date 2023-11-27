"use server";

import { revalidatePath } from "next/cache";

import { createAction } from "@/lib/create-action";
import { server } from "@/lib/server-instance";

import { InputType, ReturnType } from "./types";
import { EditDatabase, EditExecutionClient } from "./schema";
import { ChainlinkNode } from "@/types";

const handler = async (
  data: InputType,
  identifiers: Record<string, string>
): Promise<ReturnType> => {
  let node;
  try {
    const response = await server.put<ChainlinkNode>(
      `/chainlink/nodes/${identifiers.name}`,
      data
    );
    node = response.data;
  } catch (error) {
    return { error: "Something went wrong." };
  }

  revalidatePath(
    `${identifiers.workspaceId}/deployments/chainlink/${node.name}`
  );
  return { data: node };
};

export const editDatabase = createAction(EditDatabase, handler);
export const editExecutionClient = createAction(EditExecutionClient, handler);
