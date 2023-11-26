import { z } from "zod";

export const EditBitcoinAPI = z.object({
  rpc: z.boolean(),
  txIndex: z.boolean(),
  rpcUsers: z
    .array(
      z.object({
        username: z.string().min(1, "Username is required"),
        passwordSecretName: z.string().min(1, "Please select a password"),
      })
    )
    .nonempty(),
});

export const EditBitcoinWallet = z.object({
  wallet: z.boolean(),
});
