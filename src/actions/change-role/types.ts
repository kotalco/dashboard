import { z } from "zod";

import { ActionState } from "@/lib/create-action";

import { ChangeRole } from "./schema";

export type InputType = z.infer<typeof ChangeRole>;
export type ReturnType = ActionState<InputType, { message: string }>;
