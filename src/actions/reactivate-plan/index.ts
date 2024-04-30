"use server";

import { revalidatePath } from "next/cache";

import { createAction } from "@/lib/create-action";
import { server } from "@/lib/server-instance";
import { delay, logger } from "@/lib/utils";

import { InputType, ReturnType } from "./types";
import { ReactivatePlan } from "./schema";

const handler = async (data: InputType): Promise<ReturnType> => {
  let message;
  try {
    const response = await server.post<{ message: string }>(
      "/subscriptions/reactivate",
      data
    );

    message = response.data;
  } catch (error) {
    logger("ReactivatePlan", error);
    return { error: "Something went wrong." };
  }

  await delay(1000);
  revalidatePath("/billing/plan");
  return { data: message };
};

export const reactivatePlan = createAction(ReactivatePlan, handler);
