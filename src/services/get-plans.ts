import "server-only";

import { server } from "@/lib/server-instance";
import { Plan } from "@/types";

export const getPlans = async () => {
  const { data } = await server.get<Plan[]>("/plans");

  return { plans: data };
};
