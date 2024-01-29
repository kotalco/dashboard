import { z } from "zod";

import { StacksNode } from "@/types";
import { ActionState } from "@/lib/create-action";

import { EditStacks } from "./schema";

export type InputType = z.infer<typeof EditStacks>;
export type ReturnType = ActionState<InputType, StacksNode>;
