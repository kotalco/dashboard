import "server-only";

import { cache } from "react";

import { server } from "@/lib/server-instance";
import { Endpoint } from "@/types";

export const getVirtualEndpoint = cache(async (endpointName: string) => {
  const { data } = await server.get<Endpoint>(
    `/virtual-endpoints/${endpointName}`
  );

  return { endpoint: data };
});
