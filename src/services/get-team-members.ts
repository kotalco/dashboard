import "server-only";

import { cache } from "react";

import { server } from "@/lib/server-instance";
import { TeamMember } from "@/types";

export const getTeamMembers = cache(async (workspaceId: string) => {
  const { data } = await server.get<TeamMember[]>(
    `/workspaces/${workspaceId}/members`
  );

  return data;
});
