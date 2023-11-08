import "server-only";

import { cache } from "react";

import { server } from "@/lib/server-instance";
import { Plan } from "@/types";

export const getPlans = cache(async () => {
  const { data } = await server.get<Plan[]>("/plans");

  return { plans: data };
});
