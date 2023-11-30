import { PolkadotLogging, PolkadotSyncModes } from "@/enums";
import { z } from "zod";

export const EditValidator = z
  .object({
    validator: z.boolean(),
    rpc: z.boolean().optional().nullable(),
  })
  .transform(({ validator, rpc }) => {
    if (validator && rpc) {
      return { validator, rpc: false };
    }
    return { validator, rpc };
  });

export const EditTelemetry = z.object({
  telemetry: z.boolean(),
  telemetryURL: z.string().optional().nullable(),
});

export const EditPrometheus = z
  .object({
    prometheus: z.boolean(),
    prometheusPort: z
      .number({ invalid_type_error: "Prometheus Port is number" })
      .optional()
      .nullable(),
  })
  .refine(
    ({ prometheus, prometheusPort }) =>
      (prometheus &&
        prometheusPort &&
        prometheusPort >= 1 &&
        prometheusPort <= 65535) ||
      !prometheus,
    {
      message:
        "Prometheus Port is required and must be a number between 1 and 65535",
      path: ["prometheusPort"],
    }
  );

export const EditNetworking = z.object({
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

export const EditLogs = z.object({
  logging: z.nativeEnum(PolkadotLogging),
});

export const EditAPI = z
  .object({
    validator: z.boolean().nullable().optional(),
    rpc: z.boolean(),
    rpcPort: z.number({ invalid_type_error: "RPC Port is number" }).optional(),
    ws: z.boolean(),
    wsPort: z
      .number({ invalid_type_error: "WebSocket Port is number" })
      .optional(),
  })
  .refine(
    ({ rpc, rpcPort }) =>
      (rpc && rpcPort && rpcPort >= 1 && rpcPort <= 65535) || !rpc,
    {
      message: "RPC Port is required and must be a number between 1 and 65535",
      path: ["rpcPort"],
    }
  )
  .refine(
    ({ ws, wsPort }) => (ws && wsPort && wsPort >= 1 && wsPort <= 65535) || !ws,
    {
      message:
        "WebSocket Port is required and must be a number between 1 and 65535",
      path: ["wsPort"],
    }
  )
  .transform(({ rpc, validator, ...rest }) => {
    if (validator && rpc) {
      return { rpc, ...rest, validator: false };
    }
    return { rpc, validator, ...rest };
  });

export const EditAccessControl = z.object({
  corsDomains: z
    .string()
    .transform((value) =>
      value ? value.split("\n").filter((value) => !!value) : []
    )
    .refine((value) => !!value.length, {
      message: `Please specify your CORS domains or "all" to whitelist all domains`,
    }),
});
