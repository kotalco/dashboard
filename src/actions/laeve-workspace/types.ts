import { z } from "zod";

import { ActionState } from "@/lib/create-action";

import { LeaveWorkspace } from "./schema";

export type InputType = z.infer<typeof LeaveWorkspace>;
export type ReturnType = ActionState<InputType, { message: string }>;
