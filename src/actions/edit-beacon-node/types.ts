import { z } from "zod";

import { BeaconNode } from "@/types";
import { ActionState } from "@/lib/create-action";

import { EditAPI, EditCheckpointSync, EditExecutionClient } from "./schema";

export type APIInputType = z.infer<typeof EditAPI>;
export type APIReturnType = ActionState<APIInputType, BeaconNode>;

export type CheckpointSyncInputType = z.infer<typeof EditCheckpointSync>;
export type CheckpointSyncReturnType = ActionState<
  CheckpointSyncInputType,
  BeaconNode
>;

export type EditExecutionClientInputType = z.infer<typeof EditExecutionClient>;
export type EditExecutionClientReturnType = ActionState<
  EditExecutionClientInputType,
  BeaconNode
>;

export type InputType =
  | APIInputType
  | CheckpointSyncInputType
  | EditExecutionClientInputType;

export type ReturnType =
  | APIReturnType
  | CheckpointSyncReturnType
  | EditExecutionClientReturnType;
