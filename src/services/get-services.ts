import "server-only";

import qs from "query-string";

import { server } from "@/lib/server-instance";
import { Service } from "@/types";

export const getServices = async (workspace_id: string) => {
  const qUrl = qs.stringifyUrl({
    url: "/core/services",
    query: { workspace_id },
  });
  const { data } = await server.get<Service[]>(qUrl);

  return { services: data };
};
