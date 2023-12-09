"use server";

import { server } from "@/lib/server-instance";

export const getVirtualEndpointsCount = async () => {
  const { headers } = await server.head(`/virtual-endpoints`);

  return {
    count: +headers["x-total-count"],
  };
};
