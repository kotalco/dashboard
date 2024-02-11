import { z } from "zod";

import { ActionState } from "@/lib/create-action";
import { UpdatePlanStatus } from "@/types";

import { UpdatePlan } from "./schema";

export type InputType = z.infer<typeof UpdatePlan>;
export type ReturnType = ActionState<
  InputType,
  UpdatePlanStatus & { cardId?: string | null }
>;
