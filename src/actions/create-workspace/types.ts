import { z } from "zod";

import { Workspace } from "@/types";
import { ActionState } from "@/lib/create-action";

import { CreateWorkspace } from "./schema";

export type InputType = z.infer<typeof CreateWorkspace>;
export type ReturnType = ActionState<InputType, Omit<Workspace, "role">>;
