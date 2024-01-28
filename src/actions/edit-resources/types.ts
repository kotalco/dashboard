import { z } from "zod";

import { ActionState } from "@/lib/create-action";

import { EditResources } from "../../schemas/resources";

export type InputType = z.infer<typeof EditResources>;
export type ReturnType = ActionState<InputType>;
