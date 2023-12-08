import { z } from "zod";

export const LoginUser = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email("Invalid Email")
    .trim()
    .toLowerCase(),
  password: z
    .string({ required_error: "Password is required" })
    .min(6, "Password must be not less than 6 characters"),
  remember_me: z.boolean().default(false).optional().nullable(),
});
