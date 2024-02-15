import { z } from "zod";

export const CancelPlan = z.object({
  subscription_id: z.string(),
});
