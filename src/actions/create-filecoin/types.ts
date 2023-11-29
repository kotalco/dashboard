import { z } from "zod";

import { FilecoinNode } from "@/types";
import { ActionState } from "@/lib/create-action";

import { CreateFilecoin } from "./schema";

export type InputType = z.infer<typeof CreateFilecoin>;
export type ReturnType = ActionState<InputType, FilecoinNode>;
