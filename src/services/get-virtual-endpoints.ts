import "server-only";

import { cache } from "react";

import { server } from "@/lib/server-instance";
import { Endpoint } from "@/types";

export const getVirtualEndpoints = cache(async () => {
  const { data } = await server.get<Endpoint[]>("/virtual-endpoints");

  return { data };
});
