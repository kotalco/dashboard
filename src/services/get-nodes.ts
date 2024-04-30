import "server-only";

import { unstable_noStore as noStore } from "next/cache";
import qs from "query-string";

import { server } from "@/lib/server-instance";

export const getNodes = async <T>(workspace_id: string, url: string) => {
  noStore();
  const qUrl = qs.stringifyUrl({
    url,
    query: { workspace_id },
  });

  const { data, headers } = await server.get<T[]>(qUrl);

  return { data, count: +headers["x-total-count"] };
};
