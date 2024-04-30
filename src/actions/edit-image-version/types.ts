import { z } from "zod";

import { ActionState } from "@/lib/create-action";

import { EditImageVersion } from "../../schemas/image-version";

export type InputType = z.infer<typeof EditImageVersion>;
export type ReturnType = ActionState<InputType>;
