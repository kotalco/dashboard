"use server";

import { revalidatePath } from "next/cache";

import { createAction } from "@/lib/create-action";
import { server } from "@/lib/server-instance";
import { IPFSClusterPeer } from "@/types";

import { InputType, ReturnType } from "./types";
import { EditPeers } from "./schema";

const handler = async (
  data: InputType,
  identifiers: Record<string, string>
): Promise<ReturnType> => {
  let peer;
  try {
    const response = await server.put<IPFSClusterPeer>(
      `/ipfs/clusterpeers/${identifiers.name}`,
      data
    );

    peer = response.data;
  } catch (error) {
    return { error: "Something went wrong." };
  }

  revalidatePath(
    `${identifiers.workspaceId}/deployments/ipfs/cluster-peers/${peer.name}`
  );
  return { data: peer };
};

export const editPeers = createAction(EditPeers, handler);
