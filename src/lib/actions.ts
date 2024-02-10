"use server";

import { revalidatePath } from "next/cache";
import qs from "query-string";

import { server } from "@/lib/server-instance";
import { Proration, ProrationFormState, UpdatePlanStatus } from "@/types";
import { SubscriptionStatus } from "@/enums";
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

export const cancelSubscription = async (subscription_id: string) => {
  try {
    await server.post("/subscriptions/cancel", { subscription_id });

    revalidatePath("/billing/plan");
    return { message: null };
  } catch (e) {
    logger("CancelSubscription", e);
    return { message: "Something went wrong. Please try again." };
  }
};

export const getProration = async (
  subscription_id: string,
  value: string
): Promise<ProrationFormState> => {
  const [plan_id, price_id, price] = value.split(",");

  try {
    const { data } = await server.post<Proration>("/subscriptions/prorations", {
      subscription_id,
      price_id,
      provider: "stripe",
    });

    return {
      message: null,
      data: {
        proration: data,
        price,
        subscription_id,
        plan_id,
        price_id,
      },
    };
  } catch (e) {
    logger("GetProration", e);
    return {
      message: "Something went wrong. Please try again.",
      data: null,
    };
  }
};

export const updatePlan = async (
  data: Exclude<ProrationFormState["data"], null>,
  _: {
    message: string | null;
    data: { clientSecret: string; cardId: string; isLoading?: boolean } | null;
  },
  formData: FormData
) => {
  const { subscription_id, price_id, plan_id, proration } = data;
  try {
    const cardId = formData.get("cardId");
    if (!cardId && proration.amount_due) {
      return {
        message: "Please select a payment method.",
        data: null,
      };
    }

    const { data } = await server.post<UpdatePlanStatus>(
      "/subscriptions/change",
      {
        subscription_id,
        price_id,
        plan_id,
        provider: "stripe",
      }
    );
    if (!proration.amount_due || data.status === SubscriptionStatus.Active) {
      revalidatePath("/billing/plan");
      return {
        message: null,
        data: { clientSecret: "", cardId: "", isLoading: true },
      };
    }

    if (typeof cardId === "string" && proration.amount_due) {
      return {
        message: null,
        data: { clientSecret: data.client_secret, cardId, isLoading: true },
      };
    }

    return { message: "Something went wrong. Please try again.", data: null };
  } catch (e) {
    logger("UpdatePlan", e);
    return { message: "Something went wrong. Please try again.", data: null };
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
