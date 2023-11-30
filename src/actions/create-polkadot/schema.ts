import { z } from "zod";

import { PolkadotNetworks } from "@/enums";

export const CreatePolkadot = z.object({
  name: z
    .string()
    .min(1, "Node name is required")
    .max(64, "Too long name")
    .trim()
    .refine((value) => /^\S*$/.test(value), {
      message: "Invalid character used",
    }),
  network: z.nativeEnum(PolkadotNetworks, {
    errorMap: () => ({ message: "Network is required" }),
  }),
  pruning: z.boolean().default(false),
  workspace_id: z.string().min(1),
  image: z.string().min(1),
});
