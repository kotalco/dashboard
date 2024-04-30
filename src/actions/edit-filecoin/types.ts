import { z } from "zod";

import { FilecoinNode } from "@/types";
import { ActionState } from "@/lib/create-action";

import { EditFilecoin } from "./schema";

export type InputType = z.infer<typeof EditFilecoin>;
export type ReturnType = ActionState<InputType, FilecoinNode>;
