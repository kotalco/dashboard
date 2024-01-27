import "server-only";

import { unstable_noStore as noStore } from "next/cache";

import { server } from "@/lib/server-instance";
import { Workspace } from "@/types";

export const getWorkspace = async (id: string) => {
  noStore();
  const { data } = await server.get<Workspace>(`/workspaces/${id}`);

  return data;
};
