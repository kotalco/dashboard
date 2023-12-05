import "server-only";

import { server } from "@/lib/server-instance";
import { Subscription } from "@/types";

export const getSubscriptionInfo = async () => {
<<<<<<< HEAD
  const { data } = await server.get<Subscription>("/subscriptions/current");
  return data;
=======
  let subscription;
  try {
    const { data } = await server.get<Subscription>("/subscriptions/current");
    subscription = data;
  } catch (e) {}
  return subscription;
>>>>>>> a000daa (add env production)
};
