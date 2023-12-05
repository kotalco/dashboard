import { z } from "zod";

export const ResetPassword = z
  .object({
    password: z.string().min(6, "Password must be not less than 6 characters"),
    password_confirmation: z
      .string()
      .min(1, "Password confirmation is required"),
    email: z.string().email(),
    token: z.string(),
  })
  .refine(
    ({ password, password_confirmation }) => password === password_confirmation,
    { message: "Passwords didn't match", path: ["password_confirmation"] }
  );
