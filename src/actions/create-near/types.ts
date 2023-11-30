import { z } from "zod";

import { NEARNode } from "@/types";
import { ActionState } from "@/lib/create-action";

import { CreateNear } from "./schema";

export type InputType = z.infer<typeof CreateNear>;
export type ReturnType = ActionState<InputType, NEARNode>;
