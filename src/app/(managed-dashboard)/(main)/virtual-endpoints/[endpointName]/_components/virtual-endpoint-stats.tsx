import { notFound } from "next/navigation";

import { getDaysOfCurrentMonth } from "@/lib/utils";
import { EndpointStatsChart } from "@/components/shared/endpoint/endpoint-stats-chart";

import { getVirtualEndpointStats } from "@/services/get-virtual-endpoint-stats";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface VirtualEndpointStatsProps {
  name: string;
}

export const VirtualEndpointStats = async ({
  name,
}: VirtualEndpointStatsProps) => {
  const { stats } = await getVirtualEndpointStats(name);

  if (!stats) notFound();

  return (
    <div className="mb-8 grid grid-cols-12 gap-4">
      <Card className="col-span-8">
        <CardHeader>
          <CardTitle>Daily Stats</CardTitle>
        </CardHeader>
        <CardContent className="min-h-[250px]">
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
