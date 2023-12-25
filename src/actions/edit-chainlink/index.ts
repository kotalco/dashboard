"use server";

import { revalidatePath } from "next/cache";

import { createAction } from "@/lib/create-action";
import { server } from "@/lib/server-instance";
import { ChainlinkNode } from "@/types";
import { logger } from "@/lib/utils";

import { InputType, ReturnType } from "./types";
import {
  EditAPI,
  EditAccessControl,
  EditDatabase,
  EditExecutionClient,
  EditLogs,
  EditTLS,
  EditWallet,
} from "./schema";

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
    logger("EditChainLink", error);
    return { error: "Something went wrong." };
  }

  revalidatePath(
    `/${identifiers.workspaceId}/deployments/chainlink/${node.name}`
  );
  return { data: node };
};

export const editDatabase = createAction(EditDatabase, handler);
export const editExecutionClient = createAction(EditExecutionClient, handler);
export const editWallet = createAction(EditWallet, handler);
export const editTLS = createAction(EditTLS, handler);
export const editAPI = createAction(EditAPI, handler);
export const editAccessControl = createAction(EditAccessControl, handler);
export const editLogs = createAction(EditLogs, handler);
