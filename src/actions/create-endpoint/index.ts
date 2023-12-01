"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { isAxiosError } from "axios";

import { createAction } from "@/lib/create-action";
import { server } from "@/lib/server-instance";
import { Endpoint } from "@/types";

import { InputType, ReturnType } from "./types";
import { CreateEndpoint } from "./schema";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { workspace_id } = data;

  try {
    await server.post<Endpoint>("/endpoints", data);
  } catch (error) {
    if (isAxiosError(error)) {
      const { response } = error;

      if (response?.status === 400) {
        return { error: "Name already exists." };
      }

      return { error: "Something went wrong." };
    }
  }

  revalidatePath(`/${workspace_id}/endpoints`);
  redirect(`/${workspace_id}/endpoints`);
};

export const createEndpoint = createAction(CreateEndpoint, handler);
