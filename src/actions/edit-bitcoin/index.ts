"use server";

import { revalidatePath } from "next/cache";

import { createAction } from "@/lib/create-action";
import { server } from "@/lib/server-instance";
import { logger } from "@/lib/utils";
import { BitcoinNode } from "@/types";

import { InputType, ReturnType } from "./types";
import { EditBitcoinNode } from "./schema";

const handler = async (values: InputType): Promise<ReturnType> => {
  let node;
  const { name, workspaceId, ...data } = values;
  try {
    const response = await server.put<BitcoinNode>(
      `/bitcoin/nodes/${name}?workspace_id=${workspaceId}`,
      data
    );
    node = response.data;
  } catch (error) {
    logger("EditBitcoin", error);
    return { error: "Something went wrong." };
  }

  revalidatePath(`/${workspaceId}/deployments/bitcoin/${node.name}`);
  return { data: node };
};

export const editBitcoinNode = createAction(EditBitcoinNode, handler);
