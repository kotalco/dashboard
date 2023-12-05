import { z } from "zod";

export const RemoveMemeber = z.object({
  id: z.string(),
  workspaceId: z.string(),
});
