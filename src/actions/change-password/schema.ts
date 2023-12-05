import { z } from "zod";

export const ChangePassword = z
  .object({
    old_password: z
      .string({ required_error: "Old password is required" })
      .min(6, "Your current password must be not less than 6 characters"),
    password: z
      .string({ required_error: "New password is required" })
      .min(6, "Your new password must be not less than 6 characters"),
    password_confirmation: z
      .string()
      .min(1, "Password confirmation is required"),
  })
  .refine(
    ({ password, password_confirmation }) => password === password_confirmation,
    { message: "Passwords didn't match", path: ["password_confirmation"] }
  );
