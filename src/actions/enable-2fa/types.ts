import { z } from "zod";

import { ActionState } from "@/lib/create-action";

import { Enable2fa } from "./schema";

export type InputType = z.infer<typeof Enable2fa>;
export type ReturnType = ActionState<InputType, { message: string }>;
