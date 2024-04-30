import { z } from "zod";

export const ChangeEmail = z
  .object({
    oldEmail: z.string().email(),
    email: z
      .string({ required_error: "Email is required" })
      .email("Invalid Email")
      .trim()
      .toLowerCase(),
    password: z
      .string({ required_error: "Password is required" })
      .min(6, "Password must be not less than 6 characters"),
  })
  .refine((data) => data.oldEmail !== data.email, {
    message: "New email must be different from old email",
    path: ["email"],
  })
  .transform(({ oldEmail, ...values }) => ({ ...values }));
