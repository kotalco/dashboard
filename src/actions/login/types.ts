import { z } from "zod";

import { ActionState } from "@/lib/create-action";
import { LoginResponse } from "@/types";

import { LoginUser } from "./schema";

export type InputType = z.infer<typeof LoginUser>;
export type ReturnType = ActionState<
  InputType,
  LoginResponse | { email: string; status: number }
>;
