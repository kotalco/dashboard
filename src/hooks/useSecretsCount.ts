import useSWR from "swr";

import { client } from "@/lib/client-instance";

export const useSecretsCount = (workspaceId: string) => {
  const fetcher = async (url: string) => {
    const { headers } = await client.get(url);
    return headers;
  };

  const { data, mutate, isLoading } = useSWR(
    `/core/secrets?workspace_id=${workspaceId}`,
    fetcher
  );

  return { count: +data?.["x-total-count"], mutate, isLoading };
};
