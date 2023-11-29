import { z } from "zod";

import { IPFSClusterPeer } from "@/types";
import { ActionState } from "@/lib/create-action";

import { CreateClusterPeer } from "./schema";

export type InputType = z.infer<typeof CreateClusterPeer>;
export type ReturnType = ActionState<InputType, IPFSClusterPeer>;
