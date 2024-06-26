"use server";

import { revalidatePath } from "next/cache";
import { isAxiosError } from "axios";

import { createAction } from "@/lib/create-action";
import { server } from "@/lib/server-instance";
import { logger } from "@/lib/utils";

import { InputType, ReturnType } from "./types";
import { ChangePassword } from "./schema";

const handler = async (
  data: InputType,
  indetifiers: { pathname: string }
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

      logger("ChangePassword", error);
      return { error: "Something went wrong." };
    }
  }

  revalidatePath(indetifiers.pathname);
  return { data: { message: "Password Changed" } };
};

export const changePassword = createAction(ChangePassword, handler);
