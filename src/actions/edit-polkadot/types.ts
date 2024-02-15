import { z } from "zod";

import { PolkadotNode } from "@/types";
import { ActionState } from "@/lib/create-action";

import { EditPolkadot } from "./schema";

export type InputType = z.infer<typeof EditPolkadot>;
export type ReturnType = ActionState<InputType, PolkadotNode>;
