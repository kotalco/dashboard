import { notFound } from "next/navigation";

import { getVirtualEndpointStats } from "@/services/get-virtual-endpoint-stats";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EndpointStatsChart } from "@/components/shared/endpoint/endpoint-stats-chart";

interface VirtualEndpointStatsProps {
  name: string;
}

export const VirtualEndpointStats = async ({
  name,
}: VirtualEndpointStatsProps) => {
  const { stats } = await getVirtualEndpointStats(name);

  if (!stats) notFound();

  return (
    <div className="mb-8">
      <Card>
        <CardHeader>
          <CardTitle>Daily Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <EndpointStatsChart data={stats.api.daily_aggregation} />
        </CardContent>
      </Card>
    </div>
  );
};
