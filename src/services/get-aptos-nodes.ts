import "server-only";

import { cache } from "react";
import qs from "query-string";

import { server } from "@/lib/server-instance";
import { AptosNode } from "@/types";

export const getAptosNodes = cache(async (workspace_id: string) => {
  const url = qs.stringifyUrl({
    url: "/aptos/nodes",
    query: { workspace_id },
  });

  const { data } = await server.get<AptosNode[]>(url);

  return data;
});
