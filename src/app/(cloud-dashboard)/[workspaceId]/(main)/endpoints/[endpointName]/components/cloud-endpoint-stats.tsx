import { redirect } from "next/navigation";

import { getEndpointStats } from "@/services/get-endpoint-stats";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EndpointStatsChart } from "@/components/shared/endpoint/endpoint-stats-chart";

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
