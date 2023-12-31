import "server-only";

import { unstable_noStore as noStore } from "next/cache";

import { server } from "@/lib/server-instance";
import { EndpointStats } from "@/types";
import { logger } from "@/lib/utils";

export const getEndpointStats = async (workspaceId: string, name: string) => {
  noStore();
  try {
    const response = await server.get<EndpointStats>(
      `/endpoints/${name}/stats?workspace_id=${workspaceId}`
    );
    return { stats: response.data };
  } catch (error) {
    logger("GetEndpointStats", error);
    throw error;
  }
};
