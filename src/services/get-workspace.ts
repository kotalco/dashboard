import "server-only";

import { unstable_noStore as noStore } from "next/cache";

import { server } from "@/lib/server-instance";
import { Workspace } from "@/types";
import { delay } from "@/lib/utils";

export const getWorkspace = async (id: string) => {
  noStore();
  await delay(3000);
  const { data } = await server.get<Workspace>(`/workspaces/${id}`);

  return data;
};
