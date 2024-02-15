import { z } from "zod";

export const GetProration = z.object({
  subscription_id: z.string(),
  price_id: z
    .string()
    .nullable()
    .refine((value) => value !== null, { message: "Please select a plan." }),
  provider: z.literal("stripe"),
});
