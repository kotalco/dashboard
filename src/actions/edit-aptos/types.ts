import { z } from "zod";

import { AptosNode } from "@/types";
import { ActionState } from "@/lib/create-action";

import { EditAptos, EditAptosAPI } from "./schema";

type APIInputType = z.infer<typeof EditAptosAPI>;
type APIReturnType = ActionState<APIInputType, AptosNode>;

export type InputType = z.infer<typeof EditAptos>;
export type ReturnType = ActionState<InputType, AptosNode>;
