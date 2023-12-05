import { z } from "zod";

import { StacksNode } from "@/types";
import { ActionState } from "@/lib/create-action";

import { CreateStacks } from "./schema";

export type InputType = z.infer<typeof CreateStacks>;
export type ReturnType = ActionState<InputType, StacksNode>;
