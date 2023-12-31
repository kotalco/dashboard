import { redirect } from "next/navigation";

import { EndpointStats } from "@/components/shared/endpoint/endpoint-stats";

import { getEndpointStats } from "@/services/get-endpoint-stats";

interface CloudEndpointStatsProps {
  name: string;
  workspaceId: string;
}

export const CloudEndpointStats = async ({
  name,
  workspaceId,
}: CloudEndpointStatsProps) => {
  const { stats } = await getEndpointStats(workspaceId, name);

  if (!stats) redirect(`/${workspaceId}/endpoints`);

  return (
    <EndpointStats
      dailyAggregation={stats.api.daily_aggregation}
      weeklyAggregation={stats.api.weekly_aggregation}
    />
  );
};
