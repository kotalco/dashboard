"use server";

import { revalidatePath } from "next/cache";

import { createAction } from "@/lib/create-action";
import { server } from "@/lib/server-instance";

import { InputType, ReturnType } from "./types";
import { EditRegister } from "./schema";

const handler = async (
  data: InputType,
  indetifiers: { workspaceId: string }
): Promise<ReturnType> => {
  try {
    await server.post<{ message: string }>(`/settings/registration`, data);
  } catch (error) {
    return { error: "Something went wrong." };
  }

  revalidatePath(`/${indetifiers.workspaceId}/registration`);
  return { data: { message: "Settings Edited" } };
};

export const editRegister = createAction(EditRegister, handler);
