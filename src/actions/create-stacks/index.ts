"use server";

import { revalidatePath } from "next/cache";
import { isAxiosError } from "axios";

import { createAction } from "@/lib/create-action";
import { server } from "@/lib/server-instance";
import { StacksNode } from "@/types";
import { logger } from "@/lib/utils";

import { InputType, ReturnType } from "./types";
import { CreateStacks } from "./schema";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { workspace_id } = data;
  let node;
  try {
    const response = await server.post<StacksNode>("/stacks/nodes", data);
    node = response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      const { response } = error;

      if (response?.status === 400) {
        return { error: "Name already exists." };
      }

      if (response?.status === 403) {
        return { error: "Reached Nodes Limit." };
      }

      logger("CreateStacksNode", error);
      return { error: "Something went wrong." };
    }
  }

  revalidatePath(`/${workspace_id}/deployments/stacks`);
  return { data: node };
};

export const createStacksNode = createAction(CreateStacks, handler);
