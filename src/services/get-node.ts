import "server-only";

import { cache } from "react";
import qs from "query-string";

import { server } from "@/lib/server-instance";
import { AptosNode } from "@/types";

export const getNode = cache(async <T>(workspace_id: string, url: string) => {
  const qUrl = qs.stringifyUrl({
    url,
    query: { workspace_id },
  });

  const { data } = await server.get<T>(qUrl);

  return data;
});
