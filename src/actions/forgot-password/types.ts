import { z } from "zod";

import { ActionState } from "@/lib/create-action";

import { ForgotPassword } from "./schema";

export type InputType = z.infer<typeof ForgotPassword>;
export type ReturnType = ActionState<InputType, { message: string }>;
