import { z } from "zod";

import { ActionState } from "@/lib/create-action";
import { Proration } from "@/types";

import { GetProration } from "./schema";

export type InputType = z.infer<typeof GetProration>;
export type ReturnType = ActionState<InputType, Proration>;
