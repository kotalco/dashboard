import { z } from "zod";

import { IPFSPeer } from "@/types";
import { ActionState } from "@/lib/create-action";

import { CreatePeer } from "./schema";

export type InputType = z.infer<typeof CreatePeer>;
export type ReturnType = ActionState<InputType, IPFSPeer>;
