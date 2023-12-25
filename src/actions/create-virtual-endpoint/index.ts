"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { isAxiosError } from "axios";

import { createAction } from "@/lib/create-action";
import { server } from "@/lib/server-instance";
import { Endpoint } from "@/types";
import { logger } from "@/lib/utils";

import { InputType, ReturnType } from "./types";
import { CreateVirtualEndpoint } from "./schema";

const handler = async (data: InputType): Promise<ReturnType> => {
  try {
    await server.post<Endpoint>("/virtual-endpoints", data);
  } catch (error) {
    if (isAxiosError(error)) {
      const { response } = error;

      if (response?.status === 400) {
        return { error: "Name already exists." };
      }

      logger("CreateVirtualEndpoint", error);
      return { error: "Something went wrong." };
    }
  }

  revalidatePath(`/virtual-endpoints`);
  redirect(`/virtual-endpoints`);
};

export const createVirtualEndpoint = createAction(
  CreateVirtualEndpoint,
  handler
);
