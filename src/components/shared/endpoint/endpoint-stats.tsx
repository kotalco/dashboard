import { EndpointStatsChart } from "@/components/shared/endpoint/endpoint-stats-chart";
import { Tabs } from "@/components/shared/tabs/tabs";

import { getDaysOfCurrentMonth } from "@/lib/utils";

interface EndpointStatsProps {
  dailyAggregation: number[];
  weeklyAggregation: number[];
}

const TABS = [
  { label: "Daily Hits", value: "daily" },
  { label: "Weekly Hits", value: "weekly" },
];

export const EndpointStats = ({
  dailyAggregation,
  weeklyAggregation,
}: EndpointStatsProps) => {
  return (
    <Tabs tabs={TABS} cardDisplay={false}>
      <div className="min-h-[250px]">
        <EndpointStatsChart
          data={dailyAggregation}
          labels={getDaysOfCurrentMonth()}
        />
      </div>

      <div className="min-h-[250px] max-w-sm">
        <EndpointStatsChart
          data={weeklyAggregation}
          labels={["Week 1", "Week 2", "Week 3", "Week 4"]}
        />
      </div>
    </Tabs>
  );
};
