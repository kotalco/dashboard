import { z } from "zod";

import { IPFSPeer } from "@/types";
import { ActionState } from "@/lib/create-action";

import { EditAPI, EditConfigProfiles, EditRouting } from "./schema";

type APIInputType = z.infer<typeof EditAPI>;
type APIReturnType = ActionState<APIInputType, IPFSPeer>;

type ConfigProfilesInputType = z.infer<typeof EditConfigProfiles>;
type ConfigProfilesReturnType = ActionState<ConfigProfilesInputType, IPFSPeer>;

type RoutingInputType = z.infer<typeof EditRouting>;
type RoutingReturnType = ActionState<RoutingInputType, IPFSPeer>;

export type InputType =
  | APIInputType
  | ConfigProfilesInputType
  | RoutingInputType;
export type ReturnType =
  | APIReturnType
  | ConfigProfilesReturnType
  | RoutingReturnType;
