import { z } from "zod";

import { ActionState } from "@/lib/create-action";

import { DeleteNode } from "./schema";

export type APIInputType = z.infer<typeof DeleteNode>;
export type APIReturnType = ActionState<APIInputType>;
