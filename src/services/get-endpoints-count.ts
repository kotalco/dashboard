import "server-only";

import qs from "query-string";
import { unstable_noStore as noStore } from "next/cache";

import { server } from "@/lib/server-instance";

export const getEndpointsCount = async (workspace_id: string) => {
  noStore();
  const qUrl = qs.stringifyUrl({
    url: "/endpoints",
    query: { workspace_id },
  });
  const { headers } = await server.head(qUrl);

  return { count: +headers["x-total-count"] };
};
