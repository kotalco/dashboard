import { z } from "zod";

import { BitcoinNode } from "@/types";
import { ActionState } from "@/lib/create-action";

import { CreateBitcoin } from "./schema";

export type InputType = z.infer<typeof CreateBitcoin>;
export type ReturnType = ActionState<InputType, BitcoinNode>;
