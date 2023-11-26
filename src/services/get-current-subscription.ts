import "server-only";

import { server } from "@/lib/server-instance";
import { Subscription } from "@/types";
import { cache } from "react";

export const getCurrentSubscription = cache(async () => {
  const { data } = await server.get<Subscription>("/subscriptions/current");

  return { subscription: data };
});
