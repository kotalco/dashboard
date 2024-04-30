import { z } from "zod";

import { BitcoinNode } from "@/types";
import { ActionState } from "@/lib/create-action";

import { EditBitcoinNode } from "./schema";

export type InputType = z.infer<typeof EditBitcoinNode>;
export type ReturnType = ActionState<InputType, BitcoinNode>;
