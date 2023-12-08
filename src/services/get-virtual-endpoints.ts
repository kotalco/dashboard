import "server-only";

import { server } from "@/lib/server-instance";
import { Endpoint } from "@/types";

export const getVirtualEndpoints = async () => {
  const { data } = await server.get<Endpoint[]>("/virtual-endpoints");

  return { data };
};
