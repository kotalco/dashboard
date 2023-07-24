import { Roles } from "@/enums";

export interface Workspace {
  id: string;
  name: string;
  k8s_namespace: string;
  user_id: string;
  role: Roles;
}

export type WorksapcesList = Omit<Workspace, "role">[];

export interface TeamMember {
  id: string;
  email: string;
  role: Roles;
}
