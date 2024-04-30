import { z } from "zod";

export const AuthorizeUser = z.object({
  totp: z.string().length(6, "Your code must be 6 digits"),
});
