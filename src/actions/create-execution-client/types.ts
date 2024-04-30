import { z } from "zod";

import { ExecutionClientNode } from "@/types";
import { ActionState } from "@/lib/create-action";

import { CreateExecutionClient } from "./schema";

export type InputType = z.infer<typeof CreateExecutionClient>;
export type ReturnType = ActionState<InputType, ExecutionClientNode>;
