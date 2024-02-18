import { z } from "zod";

export const Identifiers = z.object({
  name: z.string(),
  workspaceId: z.string(),
});
