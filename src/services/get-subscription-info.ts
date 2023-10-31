import "server-only";

import { cache } from "react";

import { server } from "@/lib/server-instance";
import { Subscription } from "@/types";
import { SubscriptionStatus } from "@/enums";

export interface SubscriptionInfo {
  status: SubscriptionStatus;
  name?: string;
  start_date: number;
  end_date: number;
  canceled_at?: number;
}

export const getSubscriptionInfo = cache(async () => {
  const { data } = await server.get<SubscriptionInfo>("/subscriptions/current");

  return { data };
});
