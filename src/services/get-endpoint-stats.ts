import "server-only";

import { unstable_noStore as noStore } from "next/cache";
import { isAxiosError } from "axios";

import { server } from "@/lib/server-instance";
import { EndpointStats } from "@/types";
import { logger } from "@/lib/utils";

export const getEndpointStats = async (name: string) => {
  noStore();
  let stats: undefined | EndpointStats;

  try {
    const response = await server.get<EndpointStats>(
      `/endpoints/${name}/stats`
    );
    stats = response.data;
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 404) {
      return { stats, error };
    }
    logger("GetEndpointStats", error);
    throw error;
  }

  return { stats, error: undefined };
};
