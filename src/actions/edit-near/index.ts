"use server";

import { revalidatePath } from "next/cache";

import { createAction } from "@/lib/create-action";
import { server } from "@/lib/server-instance";
import { NEARNode } from "@/types";
import { logger } from "@/lib/utils";

import { InputType, ReturnType } from "./types";
import {
  EditNetworking,
  EditPrometheus,
  EditRPC,
  EditTelemetry,
  EditValidator,
} from "./schema";

const handler = async (
  data: InputType,
  identifiers: Record<string, string>
): Promise<ReturnType> => {
  let node;
  try {
    const response = await server.put<NEARNode>(
      `/near/nodes/${identifiers.name}`,
      data
    );
    node = response.data;
  } catch (error) {
    logger("EditNEAR", error);
    return { error: "Something went wrong." };
  }

  revalidatePath(`/${identifiers.workspaceId}/deployments/near/${node.name}`);
  return { data: node };
};

export const editNetworkng = createAction(EditNetworking, handler);
export const editPrometheus = createAction(EditPrometheus, handler);
export const editRPC = createAction(EditRPC, handler);
export const editTelemetry = createAction(EditTelemetry, handler);
export const editValidator = createAction(EditValidator, handler);
