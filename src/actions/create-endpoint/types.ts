import { z } from "zod";

import { Endpoint } from "@/types";
import { ActionState } from "@/lib/create-action";

import { CreateEndpoint } from "./schema";

export type InputType = z.infer<typeof CreateEndpoint>;
export type ReturnType = ActionState<InputType, Endpoint>;
