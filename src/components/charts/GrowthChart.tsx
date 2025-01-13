import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import type { ChartData, WHOStandard } from '@/types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface GrowthChartProps {
  data: ChartData;
  title: string;
  yAxisLabel: string;
  whoStandards: WHOStandard[];
}

const GrowthChart: React.FC<GrowthChartProps> = ({
  data,
  title,
  yAxisLabel,
  whoStandards,
}) => {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: title,
      },
    },
    scales: {
      y: {
        title: {
          display: true,
          text: yAxisLabel,
        },
      },
      x: {
        title: {
          display: true,
          text: 'Age (months)',
        },
      },
    },
  };

  return (
    <div className="w-full h-[400px] bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
      <Line options={options} data={data} />
    </div>
  );
};

export default GrowthChart;
