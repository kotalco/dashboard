import "server-only";

import { unstable_noStore as noStore } from "next/cache";

import { server } from "@/lib/server-instance";
import { Subscription } from "@/types";

export const getCurrentSubscription = async () => {
  noStore();
  const { data } = await server.get<Subscription>("/subscriptions/current");

  return { subscription: data };
};
