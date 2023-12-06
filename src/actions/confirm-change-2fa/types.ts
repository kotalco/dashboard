import { z } from "zod";

import { ActionState } from "@/lib/create-action";

import { ConfirmChange2fa } from "./schema";

export type InputType = z.infer<typeof ConfirmChange2fa>;
export type ReturnType = ActionState<
  InputType,
  { imageUrl?: string; message?: string }
>;
