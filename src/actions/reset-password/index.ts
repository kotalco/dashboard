"use server";

import { isAxiosError } from "axios";

import { createAction } from "@/lib/create-action";
import { server } from "@/lib/server-instance";
import { logger } from "@/lib/utils";

import { InputType, ReturnType } from "./types";
import { ResetPassword } from "./schema";

const handler = async (values: InputType): Promise<ReturnType> => {
  let message;
  try {
    const { data } = await server.post<{ message: string }>(
      `/users/reset_password`,
      values
    );
    message = data;
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 404) {
      return { error: "User not found." };
    }

    logger("ResetPasswword", error);
    return { error: "Something went wrong." };
  }

  return { data: message };
};

export const resetPassword = createAction(ResetPassword, handler);
