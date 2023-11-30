"use server";

import { revalidatePath } from "next/cache";

import { createAction } from "@/lib/create-action";
import { server } from "@/lib/server-instance";
import { PolkadotNode } from "@/types";

import { InputType, ReturnType } from "./types";
import {
  EditAPI,
  EditAccessControl,
  EditLogs,
  EditNetworking,
  EditPrometheus,
  EditTelemetry,
  EditValidator,
} from "./schema";

const handler = async (
  data: InputType,
  identifiers: Record<string, string>
): Promise<ReturnType> => {
  let node;
  try {
    const response = await server.put<PolkadotNode>(
      `/polkadot/nodes/${identifiers.name}`,
      data
    );
    node = response.data;
  } catch (error) {
    return { error: "Something went wrong." };
  }

  revalidatePath(
    `${identifiers.workspaceId}/deployments/polkadot/${node.name}`
  );
  return { data: node };
};

export const editAPI = createAction(EditAPI, handler);
export const editAccessControl = createAction(EditAccessControl, handler);
export const editLogs = createAction(EditLogs, handler);
export const editNetworking = createAction(EditNetworking, handler);
export const editPrometheus = createAction(EditPrometheus, handler);
export const editTelemetry = createAction(EditTelemetry, handler);
export const editValidator = createAction(EditValidator, handler);
