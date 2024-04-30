"use server";

import { revalidatePath } from "next/cache";
import { isAxiosError } from "axios";

import { createAction } from "@/lib/create-action";
import { server } from "@/lib/server-instance";
import { Workspace } from "@/types";
import { logger } from "@/lib/utils";

import { InputType, ReturnType } from "./types";
import { CreateWorkspace } from "./schema";

const handler = async (values: InputType): Promise<ReturnType> => {
  let workspace;
  try {
    const { data } = await server.post<Omit<Workspace, "role">>(
      "/workspaces",
      values
    );
    workspace = data;
  } catch (error) {
    if (isAxiosError(error)) {
      const { response } = error;

      if (response?.status === 409) {
        return { error: "Name already exists." };
      }

      logger("CreateWorkspace", error);
      return { error: "Something went wrong." };
    }
  }

  revalidatePath(`/${workspace?.id}`);
  return { data: workspace };
};

export const createWorkspace = createAction(CreateWorkspace, handler);
