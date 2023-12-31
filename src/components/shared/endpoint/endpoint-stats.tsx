import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EndpointStatsChart } from "@/components/shared/endpoint/endpoint-stats-chart";

import { getDaysOfCurrentMonth } from "@/lib/utils";

interface EndpointStatsProps {
  dailyAggregation: number[];
  weeklyAggregation: number[];
}

export const EndpointStats = ({
  dailyAggregation,
  weeklyAggregation,
}: EndpointStatsProps) => {
  return (
    <div className="mb-8 grid grid-cols-12 gap-4">
      <Card className="col-span-8">
        <CardHeader>
          <CardTitle>Daily Stats</CardTitle>
        </CardHeader>
        <CardContent className="min-h-[250px]">
          <EndpointStatsChart
            data={dailyAggregation}
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
            data={weeklyAggregation}
            labels={["Week 1", "Week 2", "Week 3", "Week 4"]}
          />
        </CardContent>
      </Card>
    </div>
  );
};
