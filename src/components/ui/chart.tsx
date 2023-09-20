import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  ChartData,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip
);

export const options = {
  responsive: true,
};

export interface ChartProps {
  data: number[];
  borderColor?: string;
  unit?: string;
}

export const Chart: React.FC<ChartProps> = ({ data, borderColor, unit }) => {
  const dataConfig: ChartData<"line", number[], string> = {
    labels: Array(60).fill(""),
    datasets: [
      {
        data,
        borderColor: borderColor || "rgb(35, 207, 207)",
        fill: false,
        cubicInterpolationMode: "monotone",
        pointStyle: false,
      },
    ],
  };

  return (
    <Line
      height={30}
      updateMode="none"
      options={{
        maintainAspectRatio: false,
        responsive: true,
        plugins: {
          tooltip: {
            mode: "index",
            intersect: false,
            displayColors: false,
            callbacks: {
              label: (item) => `${item.formattedValue} ${unit || ""}`,
            },
          },
          legend: {
            display: false,
          },
        },
        interaction: { intersect: false },
        scales: {
          x: {
            display: false,
          },
          y: {
            display: false,
          },
        },
      }}
      data={dataConfig}
    />
  );
};
