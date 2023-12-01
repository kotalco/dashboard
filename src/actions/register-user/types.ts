import { z } from "zod";

import { ActionState } from "@/lib/create-action";
import { User } from "@/types";

import { RegisterUser } from "./schema";

export type InputType = z.infer<typeof RegisterUser>;
export type ReturnType = ActionState<InputType, User>;
