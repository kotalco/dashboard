import { z } from "zod";

import { ChainlinkNode } from "@/types";
import { ActionState } from "@/lib/create-action";

import { CreateChainlink } from "./schema";

export type InputType = z.infer<typeof CreateChainlink>;
export type ReturnType = ActionState<InputType, ChainlinkNode>;
