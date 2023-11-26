import { z } from "zod";

import { BitcoinNode, RPCUser } from "@/types";
import { ActionState } from "@/lib/create-action";

import { EditBitcoinWallet } from "./schema";

export type APIInputType = {
  rpc: boolean;
  txIndex: boolean;
  rpcUsers: RPCUser[];
};
export type APIReturnType = ActionState<APIInputType, BitcoinNode>;

export type WalletInputType = z.infer<typeof EditBitcoinWallet>;
export type WalletReturnType = ActionState<WalletInputType, BitcoinNode>;

export type InputType = APIInputType | WalletInputType;
export type ReturnType = APIReturnType | WalletReturnType;
