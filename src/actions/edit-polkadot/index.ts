"use server";

import { revalidatePath } from "next/cache";

import { createAction } from "@/lib/create-action";
import { server } from "@/lib/server-instance";
import { PolkadotNode } from "@/types";
import { logger } from "@/lib/utils";

import { InputType, ReturnType } from "./types";
import { EditPolkadot } from "./schema";

const handler = async (values: InputType): Promise<ReturnType> => {
  let node;
  const { workspaceId, name, ...data } = values;
  try {
    const response = await server.put<PolkadotNode>(
      `/polkadot/nodes/${name}?workspace_id=${workspaceId}`,
      data
    );
    node = response.data;
  } catch (error) {
    logger("EditPolkadot", error);
    return { error: "Something went wrong." };
  }

  revalidatePath(`/${workspaceId}/deployments/polkadot/${node.name}`);
  return { data: node };
};

export const editPolkadotNode = createAction(EditPolkadot, handler);
