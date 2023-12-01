"use server";

import { revalidatePath } from "next/cache";
import { isAxiosError } from "axios";

import { createAction } from "@/lib/create-action";
import { server } from "@/lib/server-instance";

import { IPFSPeer } from "@/types";

import { InputType, ReturnType } from "./types";
import { CreatePeer } from "./schema";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { workspace_id } = data;
  let peer;
  try {
    const response = await server.post<IPFSPeer>("/ipfs/peers", data);
    peer = response.data;
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

  revalidatePath(`/${workspace_id}/deployments/ipfs?deployment=peers`);
  return { data: peer };
};

export const createPeer = createAction(CreatePeer, handler);
