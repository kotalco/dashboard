import { z } from "zod";

import { AptosNode } from "@/types";
import { ActionState } from "@/lib/create-action";

import { EditAptosAPI } from "./schema";

export type APIInputType = z.infer<typeof EditAptosAPI>;
export type APIReturnType = ActionState<APIInputType, AptosNode>;
