import { z } from "zod";

import { BitcoinNode, RPCUser } from "@/types";
import { ActionState } from "@/lib/create-action";

import { EditBitcoinAPI } from "./schema";

export type APIInputType = {
  rpc: boolean;
  txIndex: boolean;
  rpcUsers: RPCUser[];
};
export type APIReturnType = ActionState<APIInputType, BitcoinNode>;
