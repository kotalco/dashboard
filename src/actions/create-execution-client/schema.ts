import { z } from "zod";

import { ExecutionClientClients } from "@/enums";

export const CreateExecutionClient = z.object({
  name: z
    .string()
    .min(1, "Node name is required")
    .max(64, "Too long name")
    .trim()
    .refine((value) => /^\S*$/.test(value), {
      message: "Invalid character used",
    }),
  client: z.nativeEnum(ExecutionClientClients, {
    errorMap: () => ({ message: "Please select a Client" }),
  }),
  network: z
    .string({ required_error: "Network is required" })
    .min(1, "Network is required")
    .trim(),
  workspace_id: z.string().min(1),
  image: z.string().min(1),
});
