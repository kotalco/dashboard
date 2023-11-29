import { z } from "zod";

import { AptosNode } from "@/types";
import { ActionState } from "@/lib/create-action";

import { EditAptosAPI } from "./schema";

type APIInputType = z.infer<typeof EditAptosAPI>;
type APIReturnType = ActionState<APIInputType, AptosNode>;

export type InputType = APIInputType;
export type ReturnType = APIReturnType;
