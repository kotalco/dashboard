import { z } from "zod";

import { FilecoinNode } from "@/types";
import { ActionState } from "@/lib/create-action";

import { EditAPI, EditIPFS, EditLogging } from "./schema";

type EditAPIInputType = z.infer<typeof EditAPI>;
type EditAPIReturnType = ActionState<EditAPIInputType, FilecoinNode>;

type EditIPFSInputType = z.infer<typeof EditIPFS>;
type EditIPFSReturnType = ActionState<EditIPFSInputType, FilecoinNode>;

type EditLoggingInputType = z.infer<typeof EditLogging>;
type EditLoggingReturnType = ActionState<EditLoggingInputType, FilecoinNode>;

export type InputType =
  | EditAPIInputType
  | EditIPFSInputType
  | EditLoggingInputType;
export type ReturnType =
  | EditAPIReturnType
  | EditIPFSReturnType
  | EditLoggingReturnType;
