"use server";

import { revalidatePath } from "next/cache";

import { createAction } from "@/lib/create-action";
import { server } from "@/lib/server-instance";
import { BeaconNode } from "@/types";
import { logger } from "@/lib/utils";

import { InputType, ReturnType } from "./types";
import { EditBeaconNode } from "./schema";

const handler = async (values: InputType): Promise<ReturnType> => {
  let node;
  const { workspaceId, name, ...data } = values;
  try {
    const response = await server.put<BeaconNode>(
      `/ethereum2/beaconnodes/${name}?workspace_id=${workspaceId}`,
      data
    );
    node = response.data;
  } catch (error) {
    logger("EditBeaconNode", error);
    return { error: "Something went wrong." };
  }

  revalidatePath(
    `/${workspaceId}/deployments/ethereum/beacon-nodes/${node.name}`
  );
  return { data: node };
};

export const editBeaconNode = createAction(EditBeaconNode, handler);
