import React from 'react';
import { Line } from 'react-chartjs-2';
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface Measurement {
  date: string;
  height: number;
  weight: number;
  age: number;
}

interface Child {
  id: string;
  name: string;
  measurements: Measurement[];
}

interface TrendAnalysisProps {
  children: Child[];
  type: 'height' | 'weight';
}

export default function TrendAnalysis({ children, type }: TrendAnalysisProps) {
  const data = {
    labels: Array.from({ length: 60 }, (_, i) => i), // 0-60 months
    datasets: children.map((child, index) => ({
      label: child.name,
      data: child.measurements.map(m => ({
        x: m.age,
        y: type === 'height' ? m.height : m.weight,
      })),
      borderColor: [
        'rgb(75, 192, 192)',
        'rgb(255, 99, 132)',
        'rgb(54, 162, 235)',
        'rgb(255, 159, 64)',
      ][index % 4],
      backgroundColor: 'transparent',
      tension: 0.1,
    })),
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 2,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const value = context.parsed.y.toFixed(1);
            const unit = type === 'height' ? 'cm' : 'kg';
            return `${context.dataset.label}: ${value} ${unit}`;
          },
        },
      },
    },
    scales: {
      y: {
        title: {
          display: true,
          text: type === 'height' ? 'Height (cm)' : 'Weight (kg)',
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
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">
        {type === 'height' ? 'Height' : 'Weight'} Trends
      </h2>
      <Line data={data} options={options} />
    </div>
  );
}
