"use server";

import { createAction } from "@/lib/create-action";
import { server } from "@/lib/server-instance";
import { delay, logger } from "@/lib/utils";
import { UpdatePlanStatus } from "@/types";

import { InputType, ReturnType } from "./types";
import { UpdatePlan } from "./schema";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { cardId, ...values } = data;
  let status;
  try {
    if (cardId) {
      await server.post("/payment-methods/set-default", {
        payment_method_id: cardId,
        provider: "stripe",
      });
      await delay(1000);
    }

    const response = await server.post<UpdatePlanStatus>(
      "/subscriptions/change",
      values
    );
    await delay(1000);

    status = { ...response.data, cardId };
  } catch (error) {
    logger("UpdatePlan", error);
    return { error: "Something went wrong." };
  }

  return { data: status };
};

export const updatePlan = createAction(UpdatePlan, handler);
