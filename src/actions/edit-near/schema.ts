import { z } from "zod";

export const EditNetworking = z.object({
  nodePrivateKeySecretName: z.string().optional().nullable().default(""),
  minPeers: z
    .number({ invalid_type_error: "Minimum Peers is number" })
    .min(1, "Minimum Peers is greater than 0")
    .optional()
    .nullable()
    .default(5),
  p2pPort: z
    .number({ invalid_type_error: "P2P Port is number" })
    .min(1, "P2P Port is between 1 and 65535")
    .max(65535, "P2P Port is between 1 and 65535")
    .optional()
    .nullable()
    .default(24567),
  bootnodes: z
    .string()
    .transform((value) =>
      value ? value.split("\n").filter((value) => !!value) : []
    )
    .optional()
    .nullable(),
});

export const EditPrometheus = z.object({
  prometheusPort: z
    .number({ invalid_type_error: "Prometheus Port is number" })
    .min(1, "Prometheus Port is between 1 and 65535")
    .max(65535, "Prometheus Port is between 1 and 65535")
    .optional()
    .nullable()
    .default(9615),
});

export const EditRPC = z
  .object({
    rpc: z.boolean(),
    rpcPort: z
      .number({ invalid_type_error: "RPC Port is number" })
      .optional()
      .nullable(),
  })
  .refine(
    ({ rpc, rpcPort }) =>
      (rpc && rpcPort && rpcPort >= 1 && rpcPort <= 65535) || !rpc,
    {
      message: "RPC Port is required and must be a number between 1 and 65535",
      path: ["rpcPort"],
    }
  );

export const EditTelemetry = z.object({
  telemetryURL: z.string().optional().nullable(),
});

export const EditValidator = z.object({
  validatorSecretName: z.string().optional().nullable().default(""),
});
