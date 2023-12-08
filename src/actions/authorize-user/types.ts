import { z } from "zod";

import { ActionState } from "@/lib/create-action";
import { LoginResponse } from "@/types";

import { AuthorizeUser } from "./schema";

export type InputType = z.infer<typeof AuthorizeUser>;
export type ReturnType = ActionState<InputType, LoginResponse>;
