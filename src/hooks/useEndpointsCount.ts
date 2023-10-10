import useSWR from "swr";

import { client } from "@/lib/client-instance";

export const useEndpointsCount = (workspaceId: string) => {
  const fetcher = async (url: string) => {
    const { headers } = await client.head(url);
    return headers;
  };

  const { data, mutate, isLoading } = useSWR(
    `/endpoints?workspace_id=${workspaceId}`,
    fetcher
  );

  return { count: +data?.["x-total-count"], mutate, isLoading };
};
