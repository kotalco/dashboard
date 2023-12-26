import { redirect } from "next/navigation";

import { getEndpointStats } from "@/services/get-endpoint-stats";
import { getDaysOfCurrentMonth } from "@/lib/utils";

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
    <div className="mb-8 grid grid-cols-12 gap-4">
      <Card className="col-span-8">
        <CardHeader>
          <CardTitle>Daily Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <EndpointStatsChart
            data={stats.api.daily_aggregation}
            labels={getDaysOfCurrentMonth()}
          />
        </CardContent>
      </Card>

      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Weekly Stats</CardTitle>
        </CardHeader>
        <CardContent className="min-h-[250px]">
          <EndpointStatsChart
            data={stats.api.weekly_aggregation}
            labels={["Week 1", "Week 2", "Week 3", "Week 4"]}
          />
        </CardContent>
      </Card>
    </div>
  );
};
