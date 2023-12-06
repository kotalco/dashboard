import { z } from "zod";

export const ActivateLiscense = z.object({
  activation_key: z
    .string({ required_error: "Activation key is required" })
    .min(1, "Activation key is required"),
});
