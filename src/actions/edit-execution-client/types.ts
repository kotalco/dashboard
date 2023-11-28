import { z } from "zod";

import { ExecutionClientNode } from "@/types";
import { ActionState } from "@/lib/create-action";

import { EditAPI, EditAccessControl, EditLogs, EditNetworking } from "./schema";

export type APIInputType = z.infer<typeof EditAPI>;
export type APIReturnType = ActionState<APIInputType, ExecutionClientNode>;

export type AccessControlInputType = z.infer<typeof EditAccessControl>;
export type AccessControlReturnType = ActionState<
  AccessControlInputType,
  ExecutionClientNode
>;

export type LogsInputType = z.infer<typeof EditLogs>;
export type LogsReturnType = ActionState<LogsInputType, ExecutionClientNode>;

export type NetworkingInputType = z.infer<typeof EditNetworking>;
export type NetworkingReturnType = ActionState<
  NetworkingInputType,
  ExecutionClientNode
>;

export type InputType =
  | APIInputType
  | AccessControlInputType
  | LogsInputType
  | NetworkingInputType;
export type ReturnType =
  | APIReturnType
  | AccessControlReturnType
  | LogsReturnType
  | NetworkingReturnType;
