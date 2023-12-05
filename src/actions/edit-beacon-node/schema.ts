import { z } from "zod";

export const EditExecutionClient = z.object({
  executionEngineEndpoint: z
    .string({
      required_error: "Execution engine is required",
    })
    .min(1, "Execution engine is required")
    .trim(),
  jwtSecretName: z.string().min(1, "JWT secret is required"),
});

export const EditCheckpointSync = z.object({
  checkpointSyncUrl: z.string().default(""),
});

export const EditAPI = z.object({
  rest: z.boolean().optional(),
  rpc: z.boolean().optional(),
  grpc: z.boolean().optional(),
});
