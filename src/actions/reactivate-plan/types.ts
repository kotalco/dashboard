import { z } from "zod";

import { ActionState } from "@/lib/create-action";

import { ReactivatePlan } from "./schema";

export type InputType = z.infer<typeof ReactivatePlan>;
export type ReturnType = ActionState<InputType, { message: string }>;
