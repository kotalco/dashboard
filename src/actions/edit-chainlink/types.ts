import { z } from "zod";

import { ChainlinkNode } from "@/types";
import { ActionState } from "@/lib/create-action";

import {
  EditAPI,
  EditAccessControl,
  EditDatabase,
  EditExecutionClient,
  EditLogs,
  EditTLS,
  EditWallet,
} from "./schema";
import { type } from "os";

export type DatabaseInputType = z.infer<typeof EditDatabase>;
export type DatabaseReturnType = ActionState<DatabaseInputType, ChainlinkNode>;

export type ExecutionClientInputType = z.infer<typeof EditExecutionClient>;
export type ExecutionClientReturnType = ActionState<
  ExecutionClientInputType,
  ChainlinkNode
>;

export type WalletInputType = z.infer<typeof EditWallet>;
export type WalletReturnType = ActionState<WalletInputType, ChainlinkNode>;

export type TLSInputType = z.infer<typeof EditTLS>;
export type TLSReturnType = ActionState<TLSInputType, ChainlinkNode>;

export type APIInputType = z.infer<typeof EditAPI>;
export type APIReturnType = ActionState<APIInputType, ChainlinkNode>;

export type AccessControlInputType = z.infer<typeof EditAccessControl>;
export type AccessControlReturnType = ActionState<
  AccessControlInputType,
  ChainlinkNode
>;

export type LogsInputType = z.infer<typeof EditLogs>;
export type LogsReturnType = ActionState<LogsInputType, ChainlinkNode>;

export type InputType =
  | DatabaseInputType
  | ExecutionClientInputType
  | WalletInputType
  | TLSInputType
  | APIInputType
  | AccessControlInputType
  | LogsInputType;

export type ReturnType =
  | DatabaseReturnType
  | ExecutionClientReturnType
  | WalletReturnType
  | TLSReturnType
  | APIReturnType
  | AccessControlReturnType
  | LogsReturnType;
