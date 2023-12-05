import { z } from "zod";

export const LeaveWorkspace = z.object({
  id: z.string(),
});
