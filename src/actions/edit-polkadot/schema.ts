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
  prometheusPort: z
    .number({ invalid_type_error: "Prometheus Port is number" })
    .optional()
    .nullable(),
});

const EditNetworking = z.object({
  nodePrivateKeySecretName: z.string().optional().nullable().default(""),
  p2pPort: z
    .number({ invalid_type_error: "P2P Port is number" })
    .min(1, "P2P Port is between 1 and 65535")
    .max(65535, "P2P Port is between 1 and 65535")
    .default(30333),
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
  rpcPort: z.number({ invalid_type_error: "RPC Port is number" }).optional(),
  ws: z.boolean(),
  wsPort: z
    .number({ invalid_type_error: "WebSocket Port is number" })
    .optional(),
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
