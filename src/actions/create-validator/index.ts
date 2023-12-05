"use server";

import { revalidatePath } from "next/cache";
import { isAxiosError } from "axios";

import { createAction } from "@/lib/create-action";
import { server } from "@/lib/server-instance";

import { InputType, ReturnType } from "./types";
import { CreateValidator } from "./schema";
import { ValidatorNode } from "@/types";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { workspace_id } = data;
  let aptosNode;
  try {
    const response = await server.post<ValidatorNode>(
      "/ethereum2/validators",
      data
    );
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

  revalidatePath(`/${workspace_id}/deployments/ethereum?deployment=validators`);
  return { data: aptosNode };
};

export const createValidator = createAction(CreateValidator, handler);
