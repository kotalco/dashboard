import { z } from "zod";

import { ActionState } from "@/lib/create-action";

import { ChangeEmail } from "./schema";

export type InputType = z.infer<typeof ChangeEmail>;
export type ReturnType = ActionState<InputType, { message: string }>;
