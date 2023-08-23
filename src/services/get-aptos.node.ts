import "server-only";

import { cache } from "react";
import qs from "query-string";

import { server } from "@/lib/server-instance";
import { AptosNode } from "@/types";

export const getAptosNode = cache(
  async (workspace_id: string, name: string) => {
    const url = qs.stringifyUrl({
      url: `/aptos/nodes/${name}`,
      query: { workspace_id },
    });

    const { data } = await server.get<AptosNode>(url);

    return data;
  }
);
