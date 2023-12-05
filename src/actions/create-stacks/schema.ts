import { z } from "zod";

import { StacksNetworks } from "@/enums";
import { BitcoinNode } from "@/types";

export const CreateStacks = z.object({
  name: z
    .string()
    .min(1, "Node name is required")
    .max(64, "Too long name")
    .trim()
    .refine((value) => /^\S*$/.test(value), {
      message: "Invalid character used",
    }),
  network: z.nativeEnum(StacksNetworks, {
    errorMap: () => ({ message: "Network is required" }),
  }),
  bitcoinNode: z
    .string({ required_error: "Bitcoin node is required" })
    .min(1, "Bitcoin node is required")
    .transform((value) => {
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
  workspace_id: z.string().min(1),
  image: z.string().min(1),
});
