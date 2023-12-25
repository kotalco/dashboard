"use server";

import { revalidatePath } from "next/cache";
import { isAxiosError } from "axios";

import { redirect } from "next/navigation";
import { createAction } from "@/lib/create-action";
import { server } from "@/lib/server-instance";
import { logger } from "@/lib/utils";

import { InputType, ReturnType } from "./types";
import { ActivateLiscense } from "./schema";

const handler = async (data: InputType): Promise<ReturnType> => {
  try {
    await server.post<{ message: string }>(
      `/subscriptions/acknowledgment`,
      data
    );
  } catch (error) {
    if (isAxiosError(error)) {
      const { response } = error;

      if (response?.status === 500) {
        return {
          error: `Subscription can't be activated.`,
        };
      }
    }

    logger("ActivateLiscense", error);
    return { error: "Something went wrong." };
  }

  revalidatePath(`/sign-in`);
  redirect("/sign-in");
};

export const activateLiscense = createAction(ActivateLiscense, handler);
