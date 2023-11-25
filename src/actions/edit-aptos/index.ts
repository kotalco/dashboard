"use server";

import { revalidatePath } from "next/cache";

import { createAction } from "@/lib/create-action";
import { server } from "@/lib/server-instance";

import { APIInputType, APIReturnType } from "./types";
import { EditAptosAPI } from "./schema";
import { AptosNode } from "@/types";

const handler = async (
  data: APIInputType,
  identifiers: Record<string, string>
): Promise<APIReturnType> => {
  let node;
  try {
    const response = await server.put<AptosNode>(
      `/aptos/nodes/${identifiers.name}`,
      data
    );
    node = response.data;
  } catch (error) {
    return { error: "Something went wrong." };
  }

  revalidatePath(`${identifiers.workspaceId}/deployments/aptos/${node.name}`);
  return { data: node };
};

export const editAptosNode = createAction(EditAptosAPI, handler);
