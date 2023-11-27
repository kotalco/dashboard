import { z } from "zod";

import { ChainlinkNode } from "@/types";
import { ActionState } from "@/lib/create-action";

import { EditDatabase, EditExecutionClient } from "./schema";

export type DatabaseInputType = z.infer<typeof EditDatabase>;
export type DatabaseReturnType = ActionState<DatabaseInputType, ChainlinkNode>;

export type ExecutionClientInputType = z.infer<typeof EditExecutionClient>;
export type ExecutionClientReturnType = ActionState<
  ExecutionClientInputType,
  ChainlinkNode
>;

export type InputType = DatabaseInputType | ExecutionClientInputType;
export type ReturnType = DatabaseReturnType | ExecutionClientReturnType;
