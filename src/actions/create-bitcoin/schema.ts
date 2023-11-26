import { z } from "zod";

import { BitcoinNetworks } from "@/enums";

export const CreateBitcoin = z.object({
  name: z
    .string()
    .min(1, "Node name is required")
    .max(64, "Too long name")
    .trim()
    .refine((value) => /^\S*$/.test(value), {
      message: "Invalid character used",
    }),
  network: z.nativeEnum(BitcoinNetworks, {
    required_error: "Please select a Network",
  }),
  workspace_id: z.string().min(1),
  image: z.string().min(1),
});
