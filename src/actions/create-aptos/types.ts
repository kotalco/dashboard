import { z } from "zod";

import { AptosNode } from "@/types";
import { ActionState } from "@/lib/create-action";

import { CreateAptos } from "./schema";

export type InputType = z.infer<typeof CreateAptos>;
export type ReturnType = ActionState<InputType, AptosNode>;
