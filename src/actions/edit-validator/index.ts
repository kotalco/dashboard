"use server";

import { revalidatePath } from "next/cache";

import { createAction } from "@/lib/create-action";
import { server } from "@/lib/server-instance";
import { ValidatorNode } from "@/types";

import { InputType, ReturnType } from "./types";
import { EditBeaconNode, EditGraffiti, EditKeystore } from "./schema";

const handler = async (
  data: InputType,
  identifiers: Record<string, string>
): Promise<ReturnType> => {
  let node;
  try {
    const response = await server.put<ValidatorNode>(
      `/ethereum2/validators/${identifiers.name}`,
      data
    );
    node = response.data;
  } catch (error) {
    return { error: "Something went wrong." };
  }

  revalidatePath(
    `${identifiers.workspaceId}/deployments/ethereum/validators/${node.name}`
  );
  return { data: node };
};

export const editBeaconNode = createAction(EditBeaconNode, handler);
export const editGraffiti = createAction(EditGraffiti, handler);
export const editKeystore = createAction(EditKeystore, handler);
