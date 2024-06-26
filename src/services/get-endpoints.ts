import "server-only";

import qs from "query-string";

import { server } from "@/lib/server-instance";
import { Endpoint } from "@/types";

export const getEndpoints = async (workspace_id: string) => {
  const qUrl = qs.stringifyUrl({
    url: "/endpoints",
    query: { workspace_id },
  });
  const { data, headers } = await server.get<Endpoint[]>(qUrl);

  return { data, count: +headers["x-total-count"] };
};
