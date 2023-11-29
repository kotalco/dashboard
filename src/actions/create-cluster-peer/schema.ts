import { z } from "zod";

import { ConsensusAlgorithm } from "@/enums";

export const CreateClusterPeer = z
  .object({
    name: z
      .string()
      .min(1, "Peer name is required")
      .max(64, "Too long name")
      .trim()
      .refine((value) => /^\S*$/.test(value), {
        message: "Invalid character used",
      }),
    peerEndpoint: z
      .string({ required_error: "Peer endpoint is required" })
      .min(1, "Peer endpoint is required")
      .trim(),
    consensus: z.nativeEnum(ConsensusAlgorithm, {
      required_error: "Consensus algorithm is required",
    }),
    predefined: z.boolean().optional(),
    clusterSecretName: z
      .string({
        required_error: "Cluster secret is required",
      })
      .min(1, "Cluster secret is required"),
    id: z.string().optional().nullable(),
    privatekeySecretName: z.string().optional().nullable(),
    trustedPeers: z.string().array().optional().nullable(),
    bootstrapPeers: z.string().array().optional().nullable(),
    workspace_id: z.string().min(1),
    image: z.string().min(1),
  })
  .refine(
    ({ consensus, trustedPeers }) =>
      (consensus === ConsensusAlgorithm.CRDT && !!trustedPeers?.length) ||
      consensus !== ConsensusAlgorithm.CRDT,
    {
      message: "Please select your trusted peers or enter your own peers",
      path: ["trustedPeers"],
    }
  )
  .refine(
    ({ predefined, privatekeySecretName, id }) =>
      (predefined && privatekeySecretName && id) || !predefined,
    {
      message: "Please enter id and private key secret name",
      path: ["predefined"],
    }
  )
  .transform((values) => {
    delete values.predefined;
    return values;
  });
