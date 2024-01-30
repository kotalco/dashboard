"use server";

import { revalidatePath } from "next/cache";

import { createAction } from "@/lib/create-action";
import { server } from "@/lib/server-instance";
import { IPFSClusterPeer } from "@/types";
import { logger } from "@/lib/utils";

import { InputType, ReturnType } from "./types";
import { EditIpfsClusterPeer } from "./schema";

const handler = async (values: InputType): Promise<ReturnType> => {
  let peer;
  const { workspaceId, name, ...data } = values;
  try {
    const response = await server.put<IPFSClusterPeer>(
      `/ipfs/clusterpeers/${name}?workspace_id=${workspaceId}`,
      data
    );

    peer = response.data;
  } catch (error) {
    logger("EditClusterPeer", error);
    return { error: "Something went wrong." };
  }

  revalidatePath(`/${workspaceId}/deployments/ipfs/cluster-peers/${peer.name}`);
  return { data: peer };
};

export const editIpfsClusterPeer = createAction(EditIpfsClusterPeer, handler);
