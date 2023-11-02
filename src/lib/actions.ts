"use server";

import { revalidatePath } from "next/cache";
import { server } from "./server-instance";

export const prepareInvoicePayment = async (payment_intent_id: string) => {
  try {
    const { data } = await server.post<{ pi_secret: string }>(
      "/subscriptions/payment-intent",
      {
        payment_intent_id,
        provider: "stripe",
      }
    );

    revalidatePath("/billing/plan");
    return { pi_secret: data.pi_secret, message: null };
  } catch (e) {
    return {
      pi_secret: null,
      message: "Something went wrong. Please try again.",
    };
  }
};

export const cancelSubscription = async (subscription_id: string) => {
  try {
    await server.post("/subscriptions/cancel", { subscription_id });

    revalidatePath("/billing/plan");
    return { message: null };
  } catch (e) {
    return { message: "Something went wrong. Please try again." };
  }
};
