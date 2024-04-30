import { z } from "zod";

import { ChainlinkNode } from "@/types";
import { ActionState } from "@/lib/create-action";

import { EditChainlinkNode } from "./schema";

export type InputType = z.infer<typeof EditChainlinkNode>;

export type ReturnType = ActionState<InputType, ChainlinkNode>;
