import { z } from "zod";

export const Enable2fa = z.object({
  totp: z.string().length(6, "Your code must be 6 digits"),
});
