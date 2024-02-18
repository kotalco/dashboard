"use server";

import { Protocol } from "@/enums";
import { server } from "@/lib/server-instance";
import { logger } from "@/lib/utils";

export const getCounts = async (workspaceId: string) => {
  const deploymentsCountData = server.get<{
    [key in Protocol]?: number;
  }>(`/core/statefulset/count?workspace_id=${workspaceId}`);
  try {
    const endpointsCountData = server.head(
      `/endpoints?workspace_id=${workspaceId}`
    );

    const secretsCountData = server.head(
      `/core/secrets?workspace_id=${workspaceId}`
    );

    const [
      { data: depCount },
      { headers: endpointsCount },
      { headers: secretsCount },
    ] = await Promise.all([
      deploymentsCountData,
      endpointsCountData,
      secretsCountData,
    ]);

    const deploymentsCount = {
      aptos: depCount?.aptos || 0,
      bitcoin: depCount?.bitcoin || 0,
      chainlink: depCount?.chainlink || 0,
      ethereum: (depCount?.ethereum || 0) + (depCount?.ethereum2 || 0),
      filecoin: depCount?.filecoin || 0,
      ipfs: depCount?.ipfs || 0,
      near: depCount?.near || 0,
      polkadot: depCount?.polkadot || 0,
      stacks: depCount?.stacks || 0,
    };

    const count = {
      ...deploymentsCount,
      endpoints: +endpointsCount["x-total-count"],
      secrets: +secretsCount["x-total-count"],
    };

    return { count, deploymentsCount };
  } catch (error) {
    logger("GetCounts", error);
    throw error;
  }
};
