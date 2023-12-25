"use server";

import { redirect } from "next/navigation";
import { isAxiosError } from "axios";
import { cookies } from "next/headers";

import { createAction } from "@/lib/create-action";
import { server } from "@/lib/server-instance";
import { User } from "@/types";
import { StorageItems } from "@/enums";
import { logger } from "@/lib/utils";

import { InputType, ReturnType } from "./types";
import { RegisterUser } from "./schema";

const handler = async (values: InputType): Promise<ReturnType> => {
  try {
    const { data } = await server.post<User>(`/users`, values);
    if (!data.platform_admin) {
      cookies().set(StorageItems.NEW_ACCOUNT, data.email, { maxAge: 5 });
    }
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 409) {
      return { error: "Email already exists." };
    }

    if (isAxiosError(error) && error.response?.status === 403) {
      return {
        error:
          "Admin had disabled registeration. Please contact your admin to enable it.",
      };
    }

    logger("UserRegister", error);
    return { error: "Something went wrong." };
  }

  redirect("/sign-in");
};

export const registerUser = createAction(RegisterUser, handler);
