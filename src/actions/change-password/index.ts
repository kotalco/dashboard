"use server";

import { revalidatePath } from "next/cache";
import { isAxiosError } from "axios";

import { createAction } from "@/lib/create-action";
import { server } from "@/lib/server-instance";

import { InputType, ReturnType } from "./types";
import { ChangePassword } from "./schema";

const handler = async (
  data: InputType,
  indetifiers: { workspaceId: string }
): Promise<ReturnType> => {
  try {
    await server.post<{ message: string }>(`/users/change_password`, data);
  } catch (error) {
    if (isAxiosError(error)) {
      const { response } = error;

      if (response?.status === 401) {
        return {
          error: `Your current password is incorrect.`,
        };
      }

      return { error: "Something went wrong." };
    }
  }

  revalidatePath(`/${indetifiers.workspaceId}/security`);
  return { data: { message: "Password Changed" } };
};

export const changePassword = createAction(ChangePassword, handler);
