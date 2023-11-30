import { z } from "zod";

import { BitcoinNode } from "@/types";

export const EditAPI = z.object({
  rpc: z.boolean(),
});

export const EditBitcoin = z.object({
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

export const EditMining = z.object({
  mineMicroBlocks: z.boolean(),
  miner: z.boolean(),
  seedPrivateKeySecretName: z.string().optional(),
});

export const EditNetworking = z.object({
  nodePrivateKeySecretName: z.string().default(""),
});
