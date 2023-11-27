"use server";

import { revalidatePath } from "next/cache";
import { isAxiosError } from "axios";

import { createAction } from "@/lib/create-action";
import { server } from "@/lib/server-instance";

import { InputType, ReturnType } from "./types";
import { CreateAptos } from "./schema";
import { AptosNode } from "@/types";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { workspace_id } = data;
  let aptosNode;
  try {
    const response = await server.post<AptosNode>("/aptos/nodes", data);
    aptosNode = response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      const { response } = error;

      if (response?.status === 400) {
        return { error: "Name already exists." };
      }

      if (response?.status === 403) {
        return { error: "Reached Nodes Limit." };
      }

      return { error: "Something went wrong." };
    }
  }

  revalidatePath(`${workspace_id}/deployments/aptos`);
  return { data: aptosNode };
};

export const createAptosNode = createAction(CreateAptos, handler);