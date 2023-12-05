import { z } from "zod";

import { ActionState } from "@/lib/create-action";

import { EditDomain } from "./schema";

export type InputType = z.infer<typeof EditDomain>;
export type ReturnType = ActionState<InputType, { domain: string }>;
