import "server-only";

import { unstable_noStore as noStore } from "next/cache";
import qs from "query-string";

import { server } from "@/lib/server-instance";
import { isAxiosError } from "axios";

export const getNode = async <T>(workspace_id: string, url: string) => {
  noStore();
  let data: undefined | T;
  try {
    const qUrl = qs.stringifyUrl({
      url,
      query: { workspace_id },
    });

    const response = await server.get<T>(qUrl);
    data = response.data;
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 404) {
      return { data, error };
    }
    throw error;
  }

  return { data, error: undefined };
};
