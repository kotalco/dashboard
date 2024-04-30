import { z } from "zod";

import { ActionState } from "@/lib/create-action";

import { DeleteWorkspace } from "./schema";

export type InputType = z.infer<typeof DeleteWorkspace>;
export type ReturnType = ActionState<InputType, { message: string }>;
