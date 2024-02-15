"use server";

import { revalidatePath } from "next/cache";

import { createAction } from "@/lib/create-action";
import { server } from "@/lib/server-instance";
import { ValidatorNode } from "@/types";
import { logger } from "@/lib/utils";

import { InputType, ReturnType } from "./types";
import { EditValidator } from "./schema";

const handler = async (values: InputType): Promise<ReturnType> => {
  let node;
  const { workspaceId, name, ...data } = values;
  try {
    const response = await server.put<ValidatorNode>(
      `/ethereum2/validators/${name}?workspace_id=${workspaceId}`,
      data
    );
    node = response.data;
  } catch (error) {
    logger("EditValidator", error);
    return { error: "Something went wrong." };
  }

  revalidatePath(
    `/${workspaceId}/deployments/ethereum/validators/${node.name}`
  );
  return { data: node };
};

export const editValidatorNode = createAction(EditValidator, handler);
