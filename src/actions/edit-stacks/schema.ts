import { z } from "zod";

import { BitcoinNode } from "@/types";
import { Identifiers } from "@/schemas/identifiers";
import { EditImageVersion } from "@/schemas/image-version";
import { EditResources } from "@/schemas/resources";

const EditAPI = z.object({
  rpc: z.boolean(),
});

const EditBitcoin = z.object({
  bitcoinNode: z.string().transform((value) => {
    const { name, p2pPort, rpcPort, rpcUsers } = JSON.parse(
      value
    ) as BitcoinNode;
    return {
      endpoint: name,
      p2pPort,
      rpcPort,
      rpcUsername: rpcUsers[0].username,
      rpcPasswordSecretName: rpcUsers[0].passwordSecretName,
    };
  }),
});

const EditMining = z.object({
  mineMicroBlocks: z.boolean(),
  miner: z.boolean(),
  seedPrivateKeySecretName: z.string().optional().nullable(),
});

const EditNetworking = z.object({
  nodePrivateKeySecretName: z.string().default(""),
});

export const EditStacks = Identifiers.merge(EditImageVersion)
  .merge(EditResources)
  .merge(EditNetworking)
  .merge(EditAPI)
  .merge(EditBitcoin)
  .merge(EditMining);
