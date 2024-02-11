import { z } from "zod";

export const UpdatePlan = z.object({
  subscription_id: z.string(),
  plan_id: z.string(),
  price_id: z.string(),
  cardId: z.string().optional().nullable(),
  provider: z.literal("stripe"),
});
