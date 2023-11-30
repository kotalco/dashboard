import { z } from "zod";

import { PolkadotNode } from "@/types";
import { ActionState } from "@/lib/create-action";

import { CreatePolkadot } from "./schema";

export type InputType = z.infer<typeof CreatePolkadot>;
export type ReturnType = ActionState<InputType, PolkadotNode>;
