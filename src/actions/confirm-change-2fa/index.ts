"use server";

import { revalidatePath } from "next/cache";
import { isAxiosError } from "axios";

import { createAction } from "@/lib/create-action";
import { server } from "@/lib/server-instance";

import { InputType, ReturnType } from "./types";
import { ConfirmChange2fa } from "./schema";
import { logger } from "@/lib/utils";

const handler = async (
  data: InputType,
  indetifiers: { enabled: boolean; pathname: string }
): Promise<ReturnType> => {
  try {
    if (!indetifiers.enabled) {
      const response = await server.post<string>("/users/totp", data, {
        responseType: "arraybuffer",
      });
      const imageUrl = Buffer.from(response.data).toString("base64");
      return { data: { imageUrl } };
    }

    await server.post<Blob>("/users/totp/disable", data);
    revalidatePath(indetifiers.pathname);
    return { data: { message: "2FA diosabled" } };
  } catch (error) {
    if (isAxiosError(error)) {
      const { response } = error;

      if (response?.status === 400) {
        return {
          error: `Wrong Password`,
        };
      }
    }

    logger("ConfirmChange2FA", error);
    return { error: "Something went wrong." };
  }
};

export const confirmChange2fa = createAction(ConfirmChange2fa, handler);
