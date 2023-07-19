import "server-only";

import { cache } from "react";

import { WorksapcesList } from "@/types";
import { server } from "@/lib/server-instance";

export const getWorkspaces = cache(async () => {
  const { data } = await server.get<WorksapcesList>("/workspaces");

  return data;
});
