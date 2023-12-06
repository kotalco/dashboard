import { z } from "zod";

import { ActionState } from "@/lib/create-action";

import { ActivateLiscense } from "./schema";

export type InputType = z.infer<typeof ActivateLiscense>;
export type ReturnType = ActionState<InputType, { message: string }>;
