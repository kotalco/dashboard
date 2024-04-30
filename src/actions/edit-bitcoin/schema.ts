import { z } from "zod";

import { EditResources } from "@/schemas/resources";
import { EditImageVersion } from "@/schemas/image-version";
import { Identifiers } from "@/schemas/identifiers";

const RpcUser = z.object({
  username: z.string().min(1, "Username is required"),
  passwordSecretName: z.string().min(1, "Please select a password"),
});

const EditBitcoinAPI = z.object({
  rpc: z.boolean(),
  txIndex: z.boolean(),
  rpcUsers: z.array(RpcUser).nonempty(),
});

const EditBitcoinWallet = z.object({
  wallet: z.boolean(),
});

export const EditBitcoinNode = EditBitcoinAPI.merge(EditBitcoinWallet)
  .merge(EditResources)
  .merge(EditImageVersion)
  .merge(Identifiers);
