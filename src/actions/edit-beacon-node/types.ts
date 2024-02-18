import { z } from "zod";

import { BeaconNode } from "@/types";
import { ActionState } from "@/lib/create-action";

import { EditBeaconNode } from "./schema";

export type InputType = z.infer<typeof EditBeaconNode>;

export type ReturnType = ActionState<InputType, BeaconNode>;
