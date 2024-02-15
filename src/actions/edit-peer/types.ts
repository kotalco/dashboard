import { z } from "zod";

import { IPFSPeer } from "@/types";
import { ActionState } from "@/lib/create-action";

import { EditPeer } from "./schema";

export type InputType = z.infer<typeof EditPeer>;
export type ReturnType = ActionState<InputType, IPFSPeer>;
