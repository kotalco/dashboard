import { z } from "zod";

import { Endpoint } from "@/types";
import { ActionState } from "@/lib/create-action";

import { CreateVirtualEndpoint } from "./schema";

export type InputType = z.infer<typeof CreateVirtualEndpoint>;
export type ReturnType = ActionState<InputType, Endpoint>;
