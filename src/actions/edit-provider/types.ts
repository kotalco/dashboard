import { z } from "zod";

import { ActionState } from "@/lib/create-action";

import { EditProvider } from "./schema";

export type InputType = z.infer<typeof EditProvider>;
export type ReturnType = ActionState<InputType, { message: string }>;
