import { z } from "zod";

import { NEARNetworks } from "@/enums";

export const CreateNear = z.object({
  name: z
    .string()
    .min(1, "Node name is required")
    .max(64, "Too long name")
    .trim()
    .refine((value) => /^\S*$/.test(value), {
      message: "Invalid character used",
    }),
  network: z.nativeEnum(NEARNetworks, {
    errorMap: () => ({ message: "Network is required" }),
  }),
  archive: z.boolean().optional().default(false),
  workspace_id: z.string().min(1),
  image: z.string().min(1),
});
