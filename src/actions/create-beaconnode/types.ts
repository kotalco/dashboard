import { z } from "zod";

import { BeaconNode } from "@/types";
import { ActionState } from "@/lib/create-action";

import { CreateBeaconnode } from "./schema";

export type InputType = z.infer<typeof CreateBeaconnode>;
export type ReturnType = ActionState<InputType, BeaconNode>;
