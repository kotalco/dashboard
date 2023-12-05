"use server";

import { revalidatePath } from "next/cache";
import { isAxiosError } from "axios";

import { createAction } from "@/lib/create-action";
import { server } from "@/lib/server-instance";

import { InputType, ReturnType } from "./types";
import { LeaveWorkspace } from "./schema";
import { redirect } from "next/navigation";

const handler = async (data: InputType): Promise<ReturnType> => {
  try {
    await server.post<{ message: string }>(`/workspaces/${data.id}/leave`);
  } catch (error) {
    if (isAxiosError(error)) {
      const { response } = error;

      if (response?.status === 403) {
        return {
          error: `You can't leave your own workspace.`,
        };
      }
    }
    return { error: "Something went wrong." };
  }

  revalidatePath(`/`);
  redirect("/");
};

export const leaveWorkspace = createAction(LeaveWorkspace, handler);
