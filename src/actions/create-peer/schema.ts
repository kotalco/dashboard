import { z } from "zod";

export const CreatePeer = z.object({
  name: z
    .string()
    .min(1, "Peer name is required")
    .max(64, "Too long name")
    .trim()
    .refine((value) => /^\S*$/.test(value), {
      message: "Invalid character used",
    }),

  workspace_id: z.string().min(1),
  image: z.string().min(1),
});
