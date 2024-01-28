"use server";

import { revalidatePath } from "next/cache";

import { createAction } from "@/lib/create-action";
import { server } from "@/lib/server-instance";
import { logger } from "@/lib/utils";
import { AptosNode } from "@/types";

import { InputType, ReturnType } from "./types";
import { EditAptos, EditAptosAPI } from "./schema";

const handler = async (values: InputType): Promise<ReturnType> => {
  let node;
  const { name, workspaceId, ...data } = values;
  try {
    const response = await server.put<AptosNode>(
      `/aptos/nodes/${name}?workspace_id=${workspaceId}`,
      data
    );
    node = response.data;
  } catch (error) {
    logger("EditAptos", error);
    return { error: "Something went wrong." };
  }

  revalidatePath(`/${workspaceId}/deployments/aptos/${node.name}`);
  return { data: node };
};

export const editAptosNode = createAction(EditAptos, handler);
