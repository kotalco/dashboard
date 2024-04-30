import "server-only";

import { unstable_noStore as noStore } from "next/cache";
import qs from "query-string";

import { server } from "@/lib/server-instance";
import { EndpointStats } from "@/types";
import { logger } from "@/lib/utils";

export const getEndpointStats = async (
  workspaceId: string,
  name: string,
  filter: "last_month" | "last_week"
) => {
  noStore();
  const url = qs.stringifyUrl({
    url: `/endpoints/${name}/stats?workspace_id=${workspaceId}`,
    query: { type: filter },
  });
  try {
    const response = await server.get<EndpointStats>(url);
    return { stats: response.data };
  } catch (error) {
    logger("GetEndpointStats", error);
    throw error;
  }
};
