"use server";

import { revalidatePath } from "next/cache";

import { createAction } from "@/lib/create-action";
import { server } from "@/lib/server-instance";
import { IPFSPeer } from "@/types";
import { logger } from "@/lib/utils";

import { InputType, ReturnType } from "./types";
import { EditPeer } from "./schema";

const handler = async (values: InputType): Promise<ReturnType> => {
  let peer;
  const { workspaceId, name, ...data } = values;
  try {
    const response = await server.put<IPFSPeer>(
      `/ipfs/peers/${name}?workspace_id=${workspaceId}`,
      data
    );

    peer = response.data;
  } catch (error) {
    logger("EditPeer", error);
    return { error: "Something went wrong." };
  }

  revalidatePath(`/${workspaceId}/deployments/ipfs/peers/${peer.name}`);
  return { data: peer };
};

export const editIpfsPeer = createAction(EditPeer, handler);
