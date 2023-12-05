import { z } from "zod";

export const CreateEndpoint = z.object({
  name: z
    .string()
    .min(1, "Node name is required")
    .max(64, "Too long name")
    .trim()
    .refine((value) => /^\S*$/.test(value), {
      message: "Invalid character used",
    }),
  service_name: z
    .string({
      errorMap: () => ({ message: "Service name is required" }),
    })
    .min(1, { message: "Service name is required" }),
  use_basic_auth: z.boolean().optional().nullable(),
  workspace_id: z.string().min(1),
});
