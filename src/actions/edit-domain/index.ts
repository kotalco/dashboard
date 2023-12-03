"use server";

import { createAction } from "@/lib/create-action";
import { server } from "@/lib/server-instance";

import { InputType, ReturnType } from "./types";
import { EditDomain } from "./schema";

const handler = async (values: InputType): Promise<ReturnType> => {
  try {
    await server.post("/settings/domain", values);
  } catch (error) {
    return { error: "Something went wrong." };
  }

  return { data: { domain: values.domain } };
};

export const editDomain = createAction(EditDomain, handler);
