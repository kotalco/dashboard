"use server";

import { isAxiosError } from "axios";

import { createAction } from "@/lib/create-action";
import { server } from "@/lib/server-instance";
import { logger } from "@/lib/utils";

import { InputType, ReturnType } from "./types";
import { ReverifyEmail } from "./schema";

const handler = async (values: InputType): Promise<ReturnType> => {
  let message;
  try {
    const { data } = await server.post<{ message: string }>(
      `/users/resend_email_verification`,
      values
    );
    message = data;
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 400) {
      return { error: "Email already verified." };
    }

    if (isAxiosError(error) && error.response?.status === 404) {
      return { error: "Email not found." };
    }

    logger("ReverifyEmail", error);
    return { error: "Something went wrong." };
  }

  return { data: message };
};

export const reverifyEmail = createAction(ReverifyEmail, handler);
