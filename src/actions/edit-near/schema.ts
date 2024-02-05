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
  bootnodes: z
    .string()
    .transform((value) =>
      value ? value.split("\n").filter((value) => !!value) : []
    )
    .optional()
    .nullable(),
});

const EditRPC = z.object({
  rpc: z.boolean(),
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
  .merge(EditTelemetry);
