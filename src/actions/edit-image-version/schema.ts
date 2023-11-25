import { z } from "zod";

export const EditImageVersion = z.object({
  image: z.string().min(1),
});
