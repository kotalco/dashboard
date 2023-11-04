import "server-only";
import { unstable_noStore as noStore } from "next/cache";

import { server } from "@/lib/server-instance";
import { Plan } from "@/types";

export const getPlans = async () => {
  noStore();
  const { data } = await server.get<Plan[]>("/plans");

  return { plans: data };
};
