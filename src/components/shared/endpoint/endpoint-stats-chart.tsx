"use client";

import { useTheme } from "next-themes";
import { Bar } from "react-chartjs-2";
import { ChartData } from "chart.js";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip);

interface EndpointStatsChartProps {
  data: number[];
  labels: string[] | number[];
}

export const EndpointStatsChart = ({
  data,
  labels,
}: EndpointStatsChartProps) => {
  const { theme } = useTheme();
  const barColor =
    theme === "dark" ? "hsl(142.1, 70.6%, 45.3%)" : "hsl(142.1, 76.2%, 36.3%)";
  const labelsColor =
    theme === "dark" ? "hsl(210, 20%, 98%)" : "hsl(224, 71.4%, 4.1%)";
  const tooltipBgColor =
    theme === "dark" ? "hsl(0, 0%, 100%)" : "hsl(224, 71.4%, 4.1%)";
  const tooltipTextColor =
    theme === "dark" ? "hsl(224, 71.4%, 4.1%)" : "hsl(210, 20%, 98%)";

  const dataConfig: ChartData<"bar", number[], string | number> = {
    labels,
    datasets: [
      {
        barThickness: 20,
        borderRadius: 5,
        data,
        backgroundColor: barColor,
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
          legend: { display: false },
          tooltip: {
            boxPadding: 5,
            backgroundColor: tooltipBgColor,
            titleColor: tooltipTextColor,
            bodyColor: tooltipTextColor,
            yAlign: "bottom",
            callbacks: {
              label: (item) => `${item.formattedValue} hits`,
              title: () => "",
            },
          },
        },
        scales: {
          x: {
            grid: { display: false },
          },
          y: {
            grid: { display: false },
            ticks: {
              stepSize: 1,
            },
          },
        },
      }}
      data={dataConfig}
    />
  );
};
