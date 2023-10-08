import useSWR from "swr";

import { Protocol } from "@/enums";
import { client } from "@/lib/client-instance";

export const useDeploymentsCount = (workspaceId: string) => {
  const fetcher = async (url: string) => {
    const { data } = await client.get(url);
    return data;
  };

  const { data, mutate, isLoading } = useSWR<{
    [key in Protocol]?: number;
  }>(`/core/statefulset/count?workspace_id=${workspaceId}`, fetcher);

  const count = {
    aptos: data?.aptos || 0,
    bitcoin: data?.bitcoin || 0,
    chainlink: data?.chainlink || 0,
    ethereum: (data?.ethereum || 0) + (data?.ethereum2 || 0),
    filecoin: data?.filecoin || 0,
    ipfs: data?.ipfs || 0,
    near: data?.near || 0,
    polkadot: data?.polkadot || 0,
    stacks: data?.stacks || 0,
  };

  return { count, mutate, isLoading };
};
