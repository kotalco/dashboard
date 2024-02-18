import { z } from "zod";

import { PolkadotLogging, PolkadotSyncModes } from "@/enums";
import { Identifiers } from "@/schemas/identifiers";
import { EditImageVersion } from "@/schemas/image-version";
import { EditResources } from "@/schemas/resources";

const EditValidator = z.object({
  validator: z.boolean(),
});

const EditTelemetry = z.object({
  telemetry: z.boolean(),
  telemetryURL: z.string().optional().nullable(),
});

const EditPrometheus = z.object({
  prometheus: z.boolean(),
});

const EditNetworking = z.object({
  nodePrivateKeySecretName: z.string().optional().nullable().default(""),
  syncMode: z.nativeEnum(PolkadotSyncModes),
  retainedBlocks: z
    .number({ invalid_type_error: "Retained Blocks is number" })
    .min(1, "Retained Blocks is greater than 0")
    .default(256),
});

const EditLogs = z.object({
  logging: z.nativeEnum(PolkadotLogging),
});

const EditAPI = z.object({
  rpc: z.boolean(),
  ws: z.boolean(),
});

const EditAccessControl = z.object({
  corsDomains: z
    .string()
    .transform((value) =>
      value ? value.split("\n").filter((value) => !!value) : []
    )
    .refine((value) => !!value.length, {
      message: `Please specify your CORS domains or "all" to whitelist all domains`,
    }),
});

export const EditPolkadot = Identifiers.merge(EditImageVersion)
  .merge(EditResources)
  .merge(EditNetworking)
  .merge(EditValidator)
  .merge(EditAPI)
  .merge(EditTelemetry)
  .merge(EditPrometheus)
  .merge(EditAccessControl)
  .merge(EditLogs);
