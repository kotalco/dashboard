"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { isAxiosError } from "axios";

import { createAction } from "@/lib/create-action";
import { server } from "@/lib/server-instance";
import { Secret } from "@/types";
import { logger } from "@/lib/utils";

import { InputType, ReturnType } from "./types";
import { CreateSecret } from "./schema";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { workspace_id } = data;
  let node;
  try {
    const response = await server.post<Secret>("/core/secrets", data);
    node = response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      const { response } = error;

      if (response?.status === 400) {
        return { error: "Name already exists." };
      }

      logger("CreateSecret", error);
      return { error: "Something went wrong." };
    }
  }

  revalidatePath(`/${workspace_id}/secrets`);
  redirect(`/${workspace_id}/secrets`);
};

export const createSecret = createAction(CreateSecret, handler);
