import "server-only";

import { cache } from "react";

import { server } from "@/lib/server-instance";
import { Workspace } from "@/types";

export const getWorkspace = cache(async (id: string) => {
  const data = await server.get<Workspace>(`/workspaces/${id}`);

  return data;
});
