"use server";

import { revalidatePath } from "next/cache";

import { createAction } from "@/lib/create-action";
import { server } from "@/lib/server-instance";
import { logger } from "@/lib/utils";
import { AptosNode } from "@/types";

import { InputType, ReturnType } from "./types";
import { EditAptosAPI } from "./schema";

const handler = async (
  data: InputType,
  identifiers: Record<string, string>
): Promise<ReturnType> => {
  let node;
  try {
    const response = await server.put<AptosNode>(
      `/aptos/nodes/${identifiers.name}`,
      data
    );
    node = response.data;
  } catch (error) {
    logger("EditAptos", error);
    return { error: "Something went wrong." };
  }

  revalidatePath(`/${identifiers.workspaceId}/deployments/aptos/${node.name}`);
  return { data: node };
};

export const editAptosNode = createAction(EditAptosAPI, handler);
