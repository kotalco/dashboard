import "server-only";

import qs from "query-string";
import { unstable_noStore as noStore } from "next/cache";

import { server } from "@/lib/server-instance";
import { Endpoint } from "@/types";
import { isAxiosError } from "axios";

export const getEndpoint = async (
  workspace_id: string,
  endpointName: string
) => {
  noStore();
  let data: undefined | Endpoint;

  try {
    const qUrl = qs.stringifyUrl({
      url: `/endpoints/${endpointName}`,
      query: { workspace_id },
    });

    const response = await server.get<Endpoint>(qUrl);
    data = response.data;
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 404) {
      return { data, error };
    }
    throw error;
  }

  return { endpoint: data, error: undefined };
};
