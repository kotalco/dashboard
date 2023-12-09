import "server-only";

import qs from "query-string";

import { server } from "@/lib/server-instance";
import { Endpoint } from "@/types";

export const getEndpoint = async (
  workspace_id: string,
  endpointName: string
) => {
  const qUrl = qs.stringifyUrl({
    url: `/endpoints/${endpointName}`,
    query: { workspace_id },
  });

  const { data } = await server.get<Endpoint>(qUrl);

  return { endpoint: data };
};
