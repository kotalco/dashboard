"use server";

import { createAction } from "@/lib/create-action";
import { server } from "@/lib/server-instance";
import { logger } from "@/lib/utils";

import { InputType, ReturnType } from "./types";
import { GetProration } from "./schema";
import { Proration } from "@/types";

const handler = async (data: InputType): Promise<ReturnType> => {
  let proration;
  try {
    const response = await server.post<Proration>(
      "/subscriptions/prorations",
      data
    );

    proration = response.data;
  } catch (error) {
    logger("ReactivatePlan", error);
    return { error: "Something went wrong." };
  }

  return { data: proration };
};

export const getProration = createAction(GetProration, handler);
