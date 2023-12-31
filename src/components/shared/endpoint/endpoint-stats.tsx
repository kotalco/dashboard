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
      <div className="col-span-8 min-h-[250px]">
        <EndpointStatsChart
          title="Daily Hits"
          data={dailyAggregation}
          labels={getDaysOfCurrentMonth()}
        />
      </div>

      <div className="col-span-4 min-h-[250px]">
        <EndpointStatsChart
          title="Weekly Hits"
          data={weeklyAggregation}
          labels={["Week 1", "Week 2", "Week 3", "Week 4"]}
        />
      </div>
    </div>
  );
};
