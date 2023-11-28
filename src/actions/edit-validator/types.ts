import { z } from "zod";

import { ValidatorNode } from "@/types";
import { ActionState } from "@/lib/create-action";

import { EditBeaconNode, EditGraffiti, EditKeystore } from "./schema";

export type BeaconNodeInputType = z.infer<typeof EditBeaconNode>;
export type BeaconNodeReturnType = ActionState<
  BeaconNodeInputType,
  ValidatorNode
>;

export type GraffitiInputType = z.infer<typeof EditGraffiti>;
export type GraffitiReturnType = ActionState<GraffitiInputType, ValidatorNode>;

export type KeystoreInputType = z.infer<typeof EditKeystore>;
export type KeystoreReturnType = ActionState<KeystoreInputType, ValidatorNode>;

export type InputType =
  | BeaconNodeInputType
  | GraffitiInputType
  | KeystoreInputType;

export type ReturnType =
  | BeaconNodeReturnType
  | GraffitiReturnType
  | KeystoreReturnType;
