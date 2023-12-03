import "server-only";

import { unstable_noStore as noStore } from "next/cache";

import { WorksapcesList } from "@/types";
import { server } from "@/lib/server-instance";

export const getWorkspaces = async () => {
  noStore();
  const { data } = await server.get<WorksapcesList>("/workspaces");

  return data;
};
