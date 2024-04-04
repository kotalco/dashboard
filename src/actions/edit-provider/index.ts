"use server";

import { createAction } from "@/lib/create-action";
import { server } from "@/lib/server-instance";
import { logger } from "@/lib/utils";

import { InputType, ReturnType } from "./types";
import { EditProvider } from "./schema";

const handler = async (values: InputType): Promise<ReturnType> => {
  try {
    await server.post("/settings/tls", values, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  } catch (error) {
    logger("EditProviderSettings", error);
    return { error: "Something went wrong." };
  }

  return { data: { message: "success" } };
};

export const editProvider = createAction(EditProvider, handler);
