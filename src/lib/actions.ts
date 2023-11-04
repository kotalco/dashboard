"use server";

import { revalidatePath } from "next/cache";
import { server } from "@/lib/server-instance";
import { Proration, ProrationFormState } from "@/types";

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

export const reactivatePlan = async (subscription_id: string) => {
  try {
    await server.post("/subscriptions/reactivate", {
      subscription_id,
      provider: "stripe",
    });

    revalidatePath("/billing/plan");
    return { message: null };
  } catch (e) {
    return { message: "Something went wrong. Please try again." };
  }
};

export const getProration = async (subscription_id: string, value: string) => {
  const [, price_id, price] = value.split(",");

  try {
    const { data } = await server.post<Proration>("/subscriptions/prorations", {
      subscription_id,
      price_id,
      provider: "stripe",
    });

    return {
      proration: data,
      price,
    };
  } catch (e) {
    return {
      message: "Something went wrong. Please try again.",
    };
  }
};

export const updatePlan = async (
  subscription_id: string,
  _: { message: string | null },
  formData: FormData
) => {
  const plan = formData.get("plan");
  if (typeof plan === "string") {
    const [plan_id, price_id] = plan?.split(",");
    console.log("Subscription ID: ", subscription_id);
    console.log("Plan ID: ", plan_id);
    console.log("Price ID: ", price_id);
  }

  return { message: "Something went wrong. Please try again." };
};