import { z } from "zod";

import { ActionState } from "@/lib/create-action";

import { AddMember } from "./schema";

export type InputType = z.infer<typeof AddMember>;
export type ReturnType = ActionState<InputType, { message: string }>;
