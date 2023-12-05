import { z } from "zod";

import { ActionState } from "@/lib/create-action";

import { EditRegister } from "./schema";

export type InputType = z.infer<typeof EditRegister>;
export type ReturnType = ActionState<InputType, { message: string }>;
