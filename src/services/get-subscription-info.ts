import "server-only";

import { server } from "@/lib/server-instance";
import { Subscription } from "@/types";

export const getSubscriptionInfo = async () => {
  const { data } = await server.get<Subscription>("/subscriptions/current");
  return data;
};
