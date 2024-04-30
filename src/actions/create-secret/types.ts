import { z } from "zod";

import { Secret } from "@/types";
import { ActionState } from "@/lib/create-action";

import { CreateSecret } from "./schema";

export type FormDataResult = Partial<
  Record<
    "password" | "key" | "keystore" | "secret" | "tls.key" | "tls.crt",
    string
  >
>;

export type InputType = z.infer<typeof CreateSecret>;
export type ReturnType = ActionState<InputType, Secret>;
