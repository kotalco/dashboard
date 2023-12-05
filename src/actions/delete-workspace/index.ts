"use server";

import { revalidatePath } from "next/cache";
import { isAxiosError } from "axios";

import { createAction } from "@/lib/create-action";
import { server } from "@/lib/server-instance";

import { InputType, ReturnType } from "./types";
import { DeleteWorkspace } from "./schema";
import { redirect } from "next/navigation";

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
    return { error: "Something went wrong." };
  }

  revalidatePath(`/`);
  redirect("/");
};

export const deleteWorkspace = createAction(DeleteWorkspace, handler);
