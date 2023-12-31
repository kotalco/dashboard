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
  labels: string[] | number[];
  title: string;
}

export const EndpointStatsChart = ({
  data,
  labels,
  title,
}: EndpointStatsChartProps) => {
  const dataConfig: ChartData<"bar", number[], string | number> = {
    labels,
    datasets: [
      {
        barThickness: 20,
        borderRadius: 5,
        label: "No. of hits",
        data,
        backgroundColor: "hsl(142, 72%, 29%)",
      },
    ],
  };

  return (
    <Bar
      height="100%"
      options={{
        maintainAspectRatio: false,
        responsive: true,
        plugins: {
          legend: { align: "end" },
          title: {
            display: true,
            text: title,
            font: {
              size: 16,
              weight: "normal",
            },
          },
          tooltip: {
            boxPadding: 5,
            callbacks: {
              label: (item) => `${item.formattedValue} hits`,
              title: (items) =>
                items.map((item) =>
                  isNaN(Number(item.label)) ? item.label : `Day ${item.label}`
                ),
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
