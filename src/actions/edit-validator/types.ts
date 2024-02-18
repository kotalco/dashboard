import { z } from "zod";

import { ValidatorNode } from "@/types";
import { ActionState } from "@/lib/create-action";

import { EditValidator } from "./schema";

export type InputType = z.infer<typeof EditValidator>;
export type ReturnType = ActionState<InputType, ValidatorNode>;
