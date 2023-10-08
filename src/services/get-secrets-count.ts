import "server-only";

import { cache } from "react";
import qs from "query-string";

import { server } from "@/lib/server-instance";

export const getSecretsCount = cache(async (workspace_id: string) => {
  const qUrl = qs.stringifyUrl({
    url: "/core/secrets",
    query: { workspace_id },
  });
  const { headers } = await server.get(qUrl);

  return { count: +headers["x-total-count"] };
});
