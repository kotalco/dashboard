import { notFound } from "next/navigation";

import { EndpointStats } from "@/components/shared/endpoint/endpoint-stats";

import { getVirtualEndpointStats } from "@/services/get-virtual-endpoint-stats";

interface VirtualEndpointStatsProps {
  name: string;
}

export const VirtualEndpointStats = async ({
  name,
}: VirtualEndpointStatsProps) => {
  const { stats } = await getVirtualEndpointStats(name);

  if (!stats) notFound();

  return (
    <EndpointStats
      dailyAggregation={stats.api.daily_aggregation}
      weeklyAggregation={stats.api.weekly_aggregation}
    />
  );
};
