"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { isAxiosError } from "axios";

import { createAction } from "@/lib/create-action";
import { server } from "@/lib/server-instance";

import { InputType, ReturnType } from "./types";
import { Enable2fa } from "./schema";

const handler = async (
  data: InputType,
  identifiers: { pathname: string }
): Promise<ReturnType> => {
  try {
    await server.post<{ message: string }>(`/users/totp/enable`, data);
  } catch (error) {
    if (isAxiosError(error)) {
      const { response } = error;

      if (response?.status === 400) {
        return {
          error: `Wrong OTP Code.`,
        };
      }
    }
    return { error: "Something went wrong." };
  }

  revalidatePath(identifiers.pathname);
  return { data: { message: "2FA Enabled" } };
};

export const enable2fa = createAction(Enable2fa, handler);
