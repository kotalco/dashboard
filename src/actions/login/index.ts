"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { isAxiosError } from "axios";

import { createAction } from "@/lib/create-action";
import { server } from "@/lib/server-instance";
import { LoginResponse } from "@/types";
import { StorageItems } from "@/enums";

import { InputType, ReturnType } from "./types";
import { LoginUser } from "./schema";

const handler = async (values: InputType): Promise<ReturnType> => {
  try {
    const { data } = await server.post<LoginResponse>(`/sessions`, values);
    cookies().set(StorageItems.AUTH_TOKEN, data.token);

    if (!data.Authorized) {
      return { data };
    }
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 401) {
      return { error: "Wrong email or password." };
    }

    if (isAxiosError(error) && error.response?.status === 403) {
      return {
        data: { email: values.email, status: 403 },
      };
    }

    return { error: "Something went wrong." };
  }

  revalidatePath("/");
  redirect("/");
};

export const loginUser = createAction(LoginUser, handler);
