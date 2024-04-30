import "server-only";

import { unstable_noStore as noStore } from "next/cache";
import { isAxiosError } from "axios";
import qs from "query-string";

import { server } from "@/lib/server-instance";
import { logger } from "@/lib/utils";

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
    logger("GetNodeByNodeName", error);
    throw error;
  }

  return { data, error: undefined };
};
