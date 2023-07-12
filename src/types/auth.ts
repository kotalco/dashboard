import { Roles } from "@/enums";

export type User = {
  id: string;
  email: string;
  role: Roles;
  two_factor_enabled: boolean;
  platform_admin: boolean;
};
