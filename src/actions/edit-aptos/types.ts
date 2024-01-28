import { z } from "zod";

import { AptosNode } from "@/types";
import { ActionState } from "@/lib/create-action";

import { EditAptos } from "./schema";

export type InputType = z.infer<typeof EditAptos>;
export type ReturnType = ActionState<InputType, AptosNode>;
