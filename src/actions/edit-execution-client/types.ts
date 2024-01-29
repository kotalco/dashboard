import { z } from "zod";

import { ExecutionClientNode } from "@/types";
import { ActionState } from "@/lib/create-action";

import { EditExecutionClient } from "./schema";

export type InputType = z.infer<typeof EditExecutionClient>;
export type ReturnType = ActionState<InputType, ExecutionClientNode>;
