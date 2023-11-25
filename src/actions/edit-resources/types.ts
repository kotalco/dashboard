import { z } from "zod";

import { ActionState } from "@/lib/create-action";

import { EditResources } from "./schema";

export type InputType = z.infer<typeof EditResources>;
export type ReturnType = ActionState<InputType>;
