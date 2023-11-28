import { z } from "zod";

import { BeaconNodeClients } from "@/enums";

export const CreateBeaconnode = z.object({
  name: z
    .string()
    .min(1, "Node name is required")
    .max(64, "Too long name")
    .trim()
    .refine((value) => /^\S*$/.test(value), {
      message: "Invalid character used",
    }),
  client: z.nativeEnum(BeaconNodeClients, {
    errorMap: () => ({ message: "Client is required" }),
  }),
  network: z
    .string({ required_error: "Network is required" })
    .min(1, "Network is required")
    .trim(),
  executionEngineEndpoint: z
    .string({
      errorMap: () => ({ message: "Execution engine is required" }),
    })
    .min(1, "Execution engine is required")
    .trim(),
  jwtSecretName: z.string().min(1, "JWT secret is required"),
  checkpointSyncUrl: z.string().default(""),
  workspace_id: z.string().min(1),
  image: z.string().min(1),
});
