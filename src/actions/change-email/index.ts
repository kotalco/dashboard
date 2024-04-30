"use server";

import { revalidatePath } from "next/cache";
import { isAxiosError } from "axios";

import { createAction } from "@/lib/create-action";
import { server } from "@/lib/server-instance";
import { logger } from "@/lib/utils";

import { InputType, ReturnType } from "./types";
import { ChangeEmail } from "./schema";

const handler = async (
  data: InputType,
  indetifiers: Record<string, string>
): Promise<ReturnType> => {
  let node;
  try {
    const response = await server.post<{ message: string }>(
      "/users/change_email",
      data
    );
    node = response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      const { response } = error;

      if (
        response?.status === 400 &&
        response.data.message === "invalid password"
      ) {
        return { error: "Wrong Password" };
      }

      logger("ChangeEmail", error);
      return { error: "Something went wrong." };
    }
  }

  revalidatePath(indetifiers.pathname);
  return { data: node };
};

export const changeEmail = createAction(ChangeEmail, handler);
