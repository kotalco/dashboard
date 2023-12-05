"use server";

import { revalidatePath } from "next/cache";
import { isAxiosError } from "axios";

import { createAction } from "@/lib/create-action";
import { server } from "@/lib/server-instance";
import { BeaconNode } from "@/types";

import { InputType, ReturnType } from "./types";
import { CreateBeaconnode } from "./schema";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { workspace_id } = data;
  let node;
  try {
    const response = await server.post<BeaconNode>(
      "/ethereum2/beaconnodes",
      data
    );
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

  revalidatePath(
    `/${workspace_id}/deployments/ethereum?deployment=beacon-nodes`
  );
  return { data: node };
};

export const createBeaconNode = createAction(CreateBeaconnode, handler);
