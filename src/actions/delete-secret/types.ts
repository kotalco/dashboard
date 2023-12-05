import { z } from "zod";

import { ActionState } from "@/lib/create-action";

import { DeleteSecret } from "./schema";

export type APIInputType = z.infer<typeof DeleteSecret>;
export type APIReturnType = ActionState<APIInputType, unknown>;
