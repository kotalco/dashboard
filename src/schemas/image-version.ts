import { z } from "zod";

export const EditImageVersion = z.object({
  image: z.string().optional().nullable(),
});
