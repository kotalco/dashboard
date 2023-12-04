import "server-only";

import { unstable_noStore as noStore } from "next/cache";

import { server } from "@/lib/server-instance";
import { Subscription } from "@/types";

export const getSubscriptionInfo = async () => {
  noStore();
  let subscription;
  try {
    const { data } = await server.get<Subscription>("/subscriptions/current");
    subscription = data;
  } catch (e) {}
  return subscription;
};
