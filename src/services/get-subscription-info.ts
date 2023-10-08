import "server-only";

import { cache } from "react";

import { server } from "@/lib/server-instance";
import { Subscription } from "@/types";

export const getSubscriptionInfo = cache(async () => {
  const { data } = await server.get<Subscription>("/subscriptions/current");

  return { data };
});
