"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { isAxiosError } from "axios";

import { createAction } from "@/lib/create-action";
import { server } from "@/lib/server-instance";
import { LoginResponse } from "@/types";
import { StorageItems } from "@/enums";
import { logger } from "@/lib/utils";

import { InputType, ReturnType } from "./types";
import { AuthorizeUser } from "./schema";

const handler = async (values: InputType): Promise<ReturnType> => {
  try {
    const { data } = await server.post<LoginResponse>(
      `/users/totp/verify`,
      values
    );
    cookies().set(StorageItems.AUTH_TOKEN, data.token);
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 400) {
      return { error: "Wrong OTP Code." };
    }

    logger("AuthorizeUser", error);
    return { error: "Something went wrong." };
  }

  revalidatePath("/");
  redirect("/");
};

export const authorizeUser = createAction(AuthorizeUser, handler);
