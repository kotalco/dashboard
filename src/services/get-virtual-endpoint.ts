import "server-only";

import { server } from "@/lib/server-instance";
import { Endpoint } from "@/types";

export const getVirtualEndpoint = async (endpointName: string) => {
  const { data } = await server.get<Endpoint>(
    `/virtual-endpoints/${endpointName}`
  );

  return { endpoint: data };
};
