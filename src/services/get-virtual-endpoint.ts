import "server-only";

import { unstable_noStore as noStore } from "next/cache";
import { isAxiosError } from "axios";

import { server } from "@/lib/server-instance";
import { Endpoint } from "@/types";
import { logger } from "@/lib/utils";

export const getVirtualEndpoint = async (endpointName: string) => {
  noStore();
  let endpoint: undefined | Endpoint;

  try {
    const response = await server.get<Endpoint>(
      `/virtual-endpoints/${endpointName}`
    );

    endpoint = response.data;
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 404) {
      return { endpoint, error };
    }
    logger("GetVirtualEndpointByName", error);
    throw error;
  }

  return { endpoint, error: undefined };
};
