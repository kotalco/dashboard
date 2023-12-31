"use server";

import { revalidatePath } from "next/cache";

import { createAction } from "@/lib/create-action";
import { server } from "@/lib/server-instance";
import { IPFSPeer } from "@/types";
import { logger } from "@/lib/utils";

import { InputType, ReturnType } from "./types";
import { EditAPI, EditConfigProfiles, EditRouting } from "./schema";

const handler = async (
  data: InputType,
  identifiers: Record<string, string>
): Promise<ReturnType> => {
  let peer;
  try {
    const response = await server.put<IPFSPeer>(
      `/ipfs/peers/${identifiers.name}?workspace_id=${identifiers.workspaceId}`,
      data
    );

    peer = response.data;
  } catch (error) {
    logger("EditPeer", error);
    return { error: "Something went wrong." };
  }

  revalidatePath(
    `/${identifiers.workspaceId}/deployments/ipfs/peers/${peer.name}`
  );
  return { data: peer };
};

export const editAPI = createAction(EditAPI, handler);
export const editConfigProfiles = createAction(EditConfigProfiles, handler);
export const editRouting = createAction(EditRouting, handler);
