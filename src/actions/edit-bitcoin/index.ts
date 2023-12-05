"use server";

import { revalidatePath } from "next/cache";

import { createAction } from "@/lib/create-action";
import { server } from "@/lib/server-instance";

import { InputType, ReturnType } from "./types";
import { EditBitcoinAPI, EditBitcoinWallet } from "./schema";
import { BitcoinNode } from "@/types";

const handler = async (
  data: InputType,
  identifiers: Record<string, string>
): Promise<ReturnType> => {
  let node;
  try {
    const response = await server.put<BitcoinNode>(
      `/bitcoin/nodes/${identifiers.name}`,
      data
    );
    node = response.data;
  } catch (error) {
    return { error: "Something went wrong." };
  }

  revalidatePath(
    `/${identifiers.workspaceId}/deployments/bitcoin/${node.name}`
  );
  return { data: node };
};

export const editBitcoinAPI = createAction(EditBitcoinAPI, handler);
export const editBitcoinWallet = createAction(EditBitcoinWallet, handler);
