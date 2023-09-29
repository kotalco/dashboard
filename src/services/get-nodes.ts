import "server-only";

import { cache } from "react";
import qs from "query-string";

import { server } from "@/lib/server-instance";

export const getNodes = cache(async <T>(workspace_id: string, url: string) => {
  const qUrl = qs.stringifyUrl({
    url,
    query: { workspace_id },
  });
  const { data, headers } = await server.get<T[]>(qUrl);

  return { data, count: +headers["x-total-count"] };
});
