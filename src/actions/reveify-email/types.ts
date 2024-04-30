import { z } from "zod";

import { ActionState } from "@/lib/create-action";

import { ReverifyEmail } from "./schema";

export type InputType = z.infer<typeof ReverifyEmail>;
export type ReturnType = ActionState<InputType, { message: string }>;
