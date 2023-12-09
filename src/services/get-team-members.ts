import "server-only";

import { server } from "@/lib/server-instance";
import { TeamMember } from "@/types";

export const getTeamMembers = async (workspaceId: string) => {
  const { data } = await server.get<TeamMember[]>(
    `/workspaces/${workspaceId}/members`
  );

  return data;
};
