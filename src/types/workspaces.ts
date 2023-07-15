import { Roles } from "@/enums";

export interface Workspace {
  id: string;
  name: string;
  k8s_namespace: string;
  role: Roles;
}
