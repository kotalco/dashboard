"use server";

import { revalidatePath } from "next/cache";
import { isAxiosError } from "axios";

import { createAction } from "@/lib/create-action";
import { server } from "@/lib/server-instance";
import { FilecoinNode } from "@/types";

import { InputType, ReturnType } from "./types";
import { CreateFilecoin } from "./schema";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { workspace_id } = data;
  let node;
  try {
    const response = await server.post<FilecoinNode>("/filecoin/nodes", data);
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

      return { error: "Something went wrong." };
    }
  }

  revalidatePath(`/${workspace_id}/deployments/filecoin`);
  return { data: node };
};

export const creatFilecoin = createAction(CreateFilecoin, handler);
