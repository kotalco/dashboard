"use client";

import { Bar } from "react-chartjs-2";
import { ChartData } from "chart.js";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { getDaysOfCurrentMonth } from "@/lib/utils";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface EndpointStatsChartProps {
  data: number[];
}

export const EndpointStatsChart = ({ data }: EndpointStatsChartProps) => {
  const dataConfig: ChartData<"bar", number[], number> = {
    labels: getDaysOfCurrentMonth(),
    datasets: [
      {
        borderRadius: 5,
        label: "No. of hits",
        data,
        backgroundColor: "hsl(142, 72%, 29%)",
      },
    ],
  };

  return (
    <Bar
      height={90}
      options={{
        plugins: {
          legend: { align: "end" },
          tooltip: {
            boxPadding: 5,
            callbacks: {
              label: (item) => `${item.formattedValue} hits`,
              title: (items) => items.map((item) => `Day ${item.label}`),
            },
          },
        },
        scales: {
          x: { grid: { display: false } },
          y: { grid: { display: false }, ticks: { stepSize: 1 } },
        },
      }}
      data={dataConfig}
    />
  );
};
