"use server";

import { revalidatePath } from "next/cache";
import qs from "query-string";

import { server } from "@/lib/server-instance";
import { logger } from "@/lib/utils";

export const prepareInvoicePayment = async (payment_intent_id: string) => {
  try {
    const { data } = await server.post<{ pi_secret: string }>(
      "/subscriptions/payment-intent",
      {
        payment_intent_id,
        provider: "stripe",
      }
    );

    return { pi_secret: data.pi_secret, message: null };
  } catch (e) {
    logger("PrepareInvoicePayment", e);
    return {
      pi_secret: null,
      message: "Something went wrong. Please try again.",
    };
  }
};

export const createSetupIntent = async (_: {
  message: null | string;
  si_secret: null | string;
}) => {
  try {
    const { data } = await server.post<{ si_secret: string }>(
      "/payment-methods/setup-intent",
      {
        provider: "stripe",
      }
    );

    return { si_secret: data.si_secret, message: null };
  } catch (e) {
    logger("CreateSetupIntent", e);
    return {
      si_secret: null,
      message: "Something went wrong. Please try again.",
    };
  }
};

export const setDefaultCard = async (payment_method_id: string) => {
  try {
    await server.post("/payment-methods/set-default", {
      payment_method_id,
      provider: "stripe",
    });
    revalidatePath("/billing/payment-methods");
    return { message: null };
  } catch (e) {
    logger("SetDefaultCard", e);
    return { message: "Something went wrong. Please try again." };
  }
};

export const deletePaymentCard = async (id: string) => {
  const qUrl = qs.stringifyUrl({
    url: `/payment-methods/${id}`,
    query: { provider: "stripe" },
  });

  try {
    await server.delete(qUrl);
    revalidatePath("/billing/payment-methods");
    return { message: null };
  } catch (e) {
    logger("DeletePaymentCard", e);
    return { message: "Something went wrong. Please try again." };
  }
};
