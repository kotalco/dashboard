import { z } from "zod";

import { ActionState } from "@/lib/create-action";

import { ResetPassword } from "./schema";

export type InputType = z.infer<typeof ResetPassword>;
export type ReturnType = ActionState<InputType, { message: string }>;
