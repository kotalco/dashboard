import { z } from "zod";

import { ActionState } from "@/lib/create-action";

import { RemoveMemeber } from "./schema";

export type APIInputType = z.infer<typeof RemoveMemeber>;
export type APIReturnType = ActionState<APIInputType, { message: string }>;
