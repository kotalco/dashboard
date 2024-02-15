import { z } from "zod";

import { NEARNode } from "@/types";
import { ActionState } from "@/lib/create-action";

import { EditNearNode } from "./schema";

export type InputType = z.infer<typeof EditNearNode>;
export type ReturnType = ActionState<InputType, NEARNode>;
