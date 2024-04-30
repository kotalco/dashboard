import { z } from "zod";

import { Identifiers } from "@/schemas/identifiers";
import { EditImageVersion } from "@/schemas/image-version";
import { EditResources } from "@/schemas/resources";

const EditExecutionClient = z.object({
  executionEngineEndpoint: z
    .string({
      required_error: "Execution engine is required",
    })
    .min(1, "Execution engine is required")
    .trim(),
  jwtSecretName: z.string().min(1, "JWT secret is required"),
});

const EditCheckpointSync = z.object({
  checkpointSyncUrl: z.string().default(""),
});

const EditAPI = z.object({
  rest: z.boolean().optional(),
  rpc: z.boolean().optional(),
  grpc: z.boolean().optional(),
});

export const EditBeaconNode = Identifiers.merge(EditImageVersion)
  .merge(EditResources)
  .merge(EditExecutionClient)
  .merge(EditCheckpointSync)
  .merge(EditAPI);
