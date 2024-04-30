"use server";

import { revalidatePath } from "next/cache";

import { createAction } from "@/lib/create-action";
import { server } from "@/lib/server-instance";
import { FilecoinNode } from "@/types";
import { logger } from "@/lib/utils";

import { InputType, ReturnType } from "./types";
import { EditFilecoin } from "./schema";

const handler = async (values: InputType): Promise<ReturnType> => {
  let node;
  const { name, workspaceId, ...data } = values;
  try {
    const response = await server.put<FilecoinNode>(
      `/filecoin/nodes/${name}?workspace_id=${workspaceId}`,
      data
    );
    node = response.data;
  } catch (error) {
    logger("EditFileCoin", error);
    return { error: "Something went wrong." };
  }

  revalidatePath(`/${workspaceId}/deployments/filecoin/${node.name}`);
  return { data: node };
};

export const editFilecoinNode = createAction(EditFilecoin, handler);
