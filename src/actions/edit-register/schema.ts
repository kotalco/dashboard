import { z } from "zod";

export const EditRegister = z.object({
  enable_registration: z.boolean(),
});
