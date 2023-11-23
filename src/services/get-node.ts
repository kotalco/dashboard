import "server-only";

import { unstable_noStore as noStore } from "next/cache";
import qs from "query-string";

import { server } from "@/lib/server-instance";

export const getNode = async <T>(workspace_id: string, url: string) => {
  noStore();
  const qUrl = qs.stringifyUrl({
    url,
    query: { workspace_id },
  });

  const { data } = await server.get<T>(qUrl);

  return data;
};
