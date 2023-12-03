"use server";

import { revalidatePath } from "next/cache";
import { isAxiosError } from "axios";

import { createAction } from "@/lib/create-action";
import { server } from "@/lib/server-instance";

import { InputType, ReturnType } from "./types";
import { AddMember } from "./schema";

const handler = async (
  data: InputType,
  indetifiers: Record<string, string>
): Promise<ReturnType> => {
  try {
    await server.post<{ message: string }>(
      `/workspaces/${indetifiers.workspaceId}/members`,
      data
    );
  } catch (error) {
    if (isAxiosError(error)) {
      const { response } = error;
      console.log(response);
      if (response?.status === 404) {
        return {
          error: `Cann't find user with email ${data.email}. Please make sure that the user is already registered.`,
        };
      }

      if (response?.status === 409) {
        return {
          error: `${data.email} is already a member of this workspace.`,
        };
      }

      return { error: "Something went wrong." };
    }
  }

  revalidatePath(`/${indetifiers.workspaceId}/members`);
  return { data: { message: "User added" } };
};

export const addMember = createAction(AddMember, handler);
