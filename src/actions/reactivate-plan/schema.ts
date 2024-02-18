import { z } from "zod";

export const ReactivatePlan = z.object({
  subscription_id: z.string(),
  provider: z.literal("stripe"),
});
