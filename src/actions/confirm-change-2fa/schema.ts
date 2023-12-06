import { z } from "zod";

export const ConfirmChange2fa = z.object({
  password: z
    .string({ required_error: "Password is required" })
    .min(6, "Password must be not less than 6 characters"),
});
