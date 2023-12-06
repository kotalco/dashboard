import { z } from "zod";

import { Workspace } from "@/types";
import { ActionState } from "@/lib/create-action";

import { EditWorkspace } from "./schema";

type APIInputType = z.infer<typeof EditWorkspace>;
type APIReturnType = ActionState<APIInputType, Workspace>;

export type InputType = APIInputType;
export type ReturnType = APIReturnType;
