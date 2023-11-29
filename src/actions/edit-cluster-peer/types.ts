import { z } from "zod";

import { IPFSClusterPeer } from "@/types";
import { ActionState } from "@/lib/create-action";

import { EditPeers } from "./schema";

type PeersInputType = z.infer<typeof EditPeers>;
type PeersReturnType = ActionState<PeersInputType, IPFSClusterPeer>;

export type InputType = PeersInputType;
export type ReturnType = PeersReturnType;
