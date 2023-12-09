import { z } from "zod";

import { ProtocolsWithoutEthereum2 } from "@/enums";

export const CreateVirtualEndpoint = z.object({
  name: z
    .string()
    .min(1, "Node name is required")
    .max(64, "Too long name")
    .trim()
    .refine((value) => /^\S*$/.test(value), {
      message: "Invalid character used",
    }),
  protocol: z.nativeEnum(ProtocolsWithoutEthereum2, {
    errorMap: () => ({ message: "Protocol name is required" }),
  }),
  network: z.string().optional().nullable(),
  use_basic_auth: z.boolean().optional(),
});
