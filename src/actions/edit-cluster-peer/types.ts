import { z } from "zod";

import { IPFSClusterPeer } from "@/types";
import { ActionState } from "@/lib/create-action";

import { EditIpfsClusterPeer } from "./schema";

export type InputType = z.infer<typeof EditIpfsClusterPeer>;
export type ReturnType = ActionState<InputType, IPFSClusterPeer>;
