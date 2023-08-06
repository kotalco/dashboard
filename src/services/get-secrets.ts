import "server-only";

import { cache } from "react";
import qs from "query-string";

import { server } from "@/lib/server-instance";
import { Secret } from "@/types";

export const getSecret = cache(async (workspace_id: string) => {
  const url = qs.stringifyUrl({
    url: "/core/secrets",
    query: { workspace_id },
  });

  const { data } = await server.get<Secret[]>(url);

  return data;
});
