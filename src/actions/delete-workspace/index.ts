"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isAxiosError } from "axios";

import { createAction } from "@/lib/create-action";
import { server } from "@/lib/server-instance";
import { logger } from "@/lib/utils";

import { InputType, ReturnType } from "./types";
import { DeleteWorkspace } from "./schema";

const handler = async (data: InputType): Promise<ReturnType> => {
  try {
    await server.delete<{ message: string }>(`/workspaces/${data.id}`);
  } catch (error) {
    if (isAxiosError(error)) {
      const { response } = error;

      if (response?.status === 403) {
        return {
          error: `You can't delete your own workspace.`,
        };
      }
    }
    logger("DeleteWorkspace", error);
    return { error: "Something went wrong." };
  }

  revalidatePath(`/`);
  redirect("/");
};

export const deleteWorkspace = createAction(DeleteWorkspace, handler);
