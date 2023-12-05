import { z } from "zod";

import { Roles } from "@/enums";

export const ChangeRole = z.object({
  role: z.nativeEnum(Roles, {
    errorMap: () => ({ message: "Please select a your team member role" }),
  }),
});
