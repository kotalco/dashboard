import { z } from "zod";

import { Identifiers } from "@/schemas/identifiers";
import { EditImageVersion } from "@/schemas/image-version";
import { EditResources } from "@/schemas/resources";

const EditNetworking = z.object({
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

const EditPrometheus = z.object({
  prometheusPort: z
    .number({ invalid_type_error: "Prometheus Port is number" })
    .min(1, "Prometheus Port is between 1 and 65535")
    .max(65535, "Prometheus Port is between 1 and 65535")
    .optional()
    .nullable(),
});

const EditRPC = z.object({
  rpc: z.boolean(),
  rpcPort: z
    .number({ invalid_type_error: "RPC Port is number" })
    .optional()
    .nullable(),
});

const EditTelemetry = z.object({
  telemetryURL: z.string().optional().nullable(),
});

const EditValidator = z.object({
  validatorSecretName: z.string().optional().nullable(),
});

export const EditNearNode = Identifiers.merge(EditImageVersion)
  .merge(EditResources)
  .merge(EditNetworking)
  .merge(EditRPC)
  .merge(EditValidator)
  .merge(EditPrometheus)
  .merge(EditTelemetry);
