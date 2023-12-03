import "server-only";

import { server } from "@/lib/server-instance";
import { Subscription } from "@/types";

export const getSubscriptionInfo = async () => {
  let subscription;
  try {
    const { data } = await server.get<Subscription>("/subscriptions/current");
    subscription = data;
  } catch (e) {}
  return subscription;
};
