import "server-only";

import { cache } from "react";
import qs from "query-string";

import { server } from "@/lib/server-instance";

export const getEndpointsCount = cache(async (workspace_id: string) => {
  const qUrl = qs.stringifyUrl({
    url: "/endpoints",
    query: { workspace_id },
  });
  const { headers } = await server.head(qUrl);

  return { count: +headers["x-total-count"] };
});
