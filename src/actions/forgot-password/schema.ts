import { z } from "zod";

export const ForgotPassword = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email("Invalid Email")
    .trim()
    .toLowerCase(),
});
