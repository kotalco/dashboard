import { z } from "zod";

import { ActionState } from "@/lib/create-action";

import { ChangePassword } from "./schema";

export type InputType = z.infer<typeof ChangePassword>;
export type ReturnType = ActionState<InputType, { message: string }>;
