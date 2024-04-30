import { z } from "zod";

import { Roles } from "@/enums";

export const AddMember = z.object({
  email: z.string().email("Invalid email address").trim().toLowerCase(),
  role: z.nativeEnum(Roles, {
    errorMap: () => ({ message: "Please select a your team member role" }),
  }),
});
