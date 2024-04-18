"use server";

import { revalidatePath } from "next/cache";

import { createAction } from "@/lib/create-action";
import { server } from "@/lib/server-instance";
import { delay, logger } from "@/lib/utils";
import { UpdatePlanStatus } from "@/types";
import { SubscriptionStatus } from "@/enums";

import { InputType, ReturnType } from "./types";
import { UpdatePlan } from "./schema";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { cardId, ...values } = data;
  let status;
  try {
    const response = await server.post<UpdatePlanStatus>(
      "/subscriptions/change",
      values
    );
    await delay(1000);
    if (response.data.status === SubscriptionStatus.Active) {
      revalidatePath("/billing/plan");
    }

    status = { ...response.data, cardId };
  } catch (error) {
    logger("UpdatePlan", error);
    return { error: "Something went wrong." };
  }

  return { data: status };
};

export const updatePlan = createAction(UpdatePlan, handler);
