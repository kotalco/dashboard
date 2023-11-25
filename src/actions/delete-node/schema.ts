import { z } from "zod";

export const DeleteNode = z.object({
  name: z.string(),
});
