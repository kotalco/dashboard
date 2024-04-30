"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { EndpointStatsChart } from "@/components/shared/endpoint/endpoint-stats-chart";
import { Tabs } from "@/components/shared/tabs/tabs";
import { Heading } from "@/components/ui/heading";

import { formatDate } from "@/lib/utils";

interface EndpointStatsProps {
  stats: { [date: string]: number }[];
}

const TABS = [
  { label: "Last Month", value: "last_month" },
  { label: "Last Week", value: "last_week" },
];

export const EndpointStats = ({ stats }: EndpointStatsProps) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const labels = stats.map((obj) => formatDate(Object.keys(obj)[0], "dd"));
  const data = stats.map((obj) => Object.values(obj)[0]);

  const onFilterChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("filter", value);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <>
      <Heading variant="h3" title="Usage" />
      <Tabs
        tabs={TABS}
        defaultTab={searchParams.get("filter") || "last_month"}
        cardDisplay={false}
        onValueChange={onFilterChange}
      >
        <div className="min-h-[250px]">
          <EndpointStatsChart data={data} labels={labels} />
        </div>

        <div className="min-h-[250px]">
          <EndpointStatsChart data={data} labels={labels} />
        </div>
      </Tabs>
    </>
  );
};
