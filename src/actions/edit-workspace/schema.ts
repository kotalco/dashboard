import { z } from "zod";

export const EditWorkspace = z.object({
  name: z.string().min(3, "Workspace name must be 3 characters at least"),
});
