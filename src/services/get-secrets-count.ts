import "server-only";

import qs from "query-string";
import { unstable_noStore as noStore } from "next/cache";

import { server } from "@/lib/server-instance";

export const getSecretsCount = async (workspace_id: string) => {
  noStore();
  const qUrl = qs.stringifyUrl({
    url: "/core/secrets",
    query: { workspace_id },
  });
  const { headers } = await server.get(qUrl);

  return { count: +headers["x-total-count"] };
};
