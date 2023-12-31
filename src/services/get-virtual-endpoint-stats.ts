import "server-only";

import { unstable_noStore as noStore } from "next/cache";

import { server } from "@/lib/server-instance";
import { EndpointStats } from "@/types";
import { delay, logger } from "@/lib/utils";

export const getVirtualEndpointStats = async (name: string) => {
  noStore();
  await delay(5000);
  try {
    const response = await server.get<EndpointStats>(
      `/virtual-endpoints/${name}/stats`
    );
    return { stats: response.data };
  } catch (error) {
    logger("GetVirtualEndpointStats", error);
    throw error;
  }
};
