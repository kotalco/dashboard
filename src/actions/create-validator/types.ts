import { z } from "zod";

import { ValidatorNode } from "@/types";
import { ActionState } from "@/lib/create-action";

import { CreateValidator } from "./schema";

export type InputType = z.infer<typeof CreateValidator>;
export type ReturnType = ActionState<InputType, ValidatorNode>;
