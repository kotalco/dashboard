import { z } from "zod";

import { AptosNetworks } from "@/enums";

export const CreateAptos = z.object({
  name: z
    .string()
    .min(1, "Node name is required")
    .max(64, "Too long name")
    .trim()
    .refine((value) => /^\S*$/.test(value), {
      message: "Invalid character used",
    }),
  network: z.nativeEnum(AptosNetworks, {
    errorMap: () => ({ message: "Please select a Network" }),
  }),
  workspace_id: z.string().min(1),
  image: z.string().min(1),
});
