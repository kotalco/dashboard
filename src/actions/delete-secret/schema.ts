import { z } from "zod";

export const DeleteSecret = z.object({
  name: z.string(),
  workspaceId: z.string(),
});
