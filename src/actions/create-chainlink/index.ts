"use server";

import { revalidatePath } from "next/cache";
import { isAxiosError } from "axios";

import { createAction } from "@/lib/create-action";
import { server } from "@/lib/server-instance";
import { logger } from "@/lib/utils";
import { ChainlinkNode } from "@/types";

import { InputType, ReturnType } from "./types";
import { CreateChainlink } from "./schema";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { workspace_id } = data;
  let node;
  try {
    const response = await server.post<ChainlinkNode>("/chainlink/nodes", data);
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

      logger("CreateChainlinkNode", error);
      return { error: "Something went wrong." };
    }
  }

  revalidatePath(`/${workspace_id}/deployments/chainlink`);
  return { data: node };
};

export const createChainlink = createAction(CreateChainlink, handler);
