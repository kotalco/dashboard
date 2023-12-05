import { z } from "zod";

import { StacksNode } from "@/types";
import { ActionState } from "@/lib/create-action";

import { EditAPI, EditBitcoin, EditMining, EditNetworking } from "./schema";

type APIInputType = z.infer<typeof EditAPI>;
type APIReturnType = ActionState<APIInputType, StacksNode>;

type BitcoinInputType = z.infer<typeof EditBitcoin>;
type BitcoinReturnType = ActionState<BitcoinInputType, StacksNode>;

type MiningInputType = z.infer<typeof EditMining>;
type MiningReturnType = ActionState<MiningInputType, StacksNode>;

type NetworkingInputType = z.infer<typeof EditNetworking>;
type NetworkingReturnType = ActionState<NetworkingInputType, StacksNode>;

export type InputType =
  | APIInputType
  | BitcoinInputType
  | MiningInputType
  | NetworkingInputType;
export type ReturnType =
  | APIReturnType
  | BitcoinReturnType
  | MiningReturnType
  | NetworkingReturnType;
