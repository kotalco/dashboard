import useSWR from "swr";

import { client } from "@/lib/client-instance";

export const useVirtualEndpointsCount = () => {
  const fetcher = async (url: string) => {
    const { headers } = await client.head(url);
    return headers;
  };

  const { data, mutate, isLoading } = useSWR(`/virtual-endpoints`, fetcher);

  return { count: +data?.["x-total-count"], mutate, isLoading };
};
