import { z } from "zod";

import { ActionState } from "@/lib/create-action";

import { CancelPlan } from "./schema";

export type InputType = z.infer<typeof CancelPlan>;
export type ReturnType = ActionState<InputType, { message: string }>;
