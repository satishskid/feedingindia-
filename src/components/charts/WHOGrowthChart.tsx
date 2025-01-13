import React, { useEffect, useState } from 'react';
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
import { WHOData, WHOStandard, loadWHOData } from '../../utils/whoStandards';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface WHOGrowthChartProps {
  type: 'height' | 'weight';
  gender: 'boy' | 'girl';
  showPercentiles?: boolean;
}

export default function WHOGrowthChart({ type, gender, showPercentiles = true }: WHOGrowthChartProps) {
  const [whoData, setWhoData] = useState<WHOData | null>(null);

  useEffect(() => {
    loadWHOData().then(setWhoData);
  }, []);

  if (!whoData) return <div>Loading...</div>;

  const standards = type === 'height'
    ? (gender === 'boy' ? whoData.heightBoys : whoData.heightGirls)
    : (gender === 'boy' ? whoData.weightBoys : whoData.weightGirls);

  const getPercentileValue = (data: WHOStandard[], percentile: number) => {
    const sd = percentile > 50
      ? (data[0].SD1 - data[0].SD0) / 0.6745
      : (data[0].SD0 - data[0].SD1neg) / 0.6745;
    
    const zScore = (percentile - 50) / (50 / 2);
    return data.map(d => d.SD0 + (zScore * sd));
  };

  const data = {
    labels: standards.map(s => s.age),
    datasets: [
      {
        label: 'Median (50th percentile)',
        data: standards.map(s => s.SD0),
        borderColor: 'rgb(0, 0, 0)',
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        borderWidth: 2,
      },
      {
        label: '97th percentile',
        data: standards.map(s => s.SD2),
        borderColor: 'rgba(255, 99, 132, 0.8)',
        backgroundColor: 'rgba(255, 99, 132, 0.1)',
        borderWidth: 1,
        borderDash: [5, 5],
      },
      {
        label: '85th percentile',
        data: getPercentileValue(standards, 85),
        borderColor: 'rgba(255, 159, 64, 0.8)',
        backgroundColor: 'rgba(255, 159, 64, 0.1)',
        borderWidth: 1,
        borderDash: [5, 5],
      },
      {
        label: '15th percentile',
        data: getPercentileValue(standards, 15),
        borderColor: 'rgba(75, 192, 192, 0.8)',
        backgroundColor: 'rgba(75, 192, 192, 0.1)',
        borderWidth: 1,
        borderDash: [5, 5],
      },
      {
        label: '3rd percentile',
        data: standards.map(s => s.SD2neg),
        borderColor: 'rgba(54, 162, 235, 0.8)',
        backgroundColor: 'rgba(54, 162, 235, 0.1)',
        borderWidth: 1,
        borderDash: [5, 5],
      },
    ].filter((_, index) => showPercentiles ? true : index === 0),
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 2,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: { size: 12 },
        },
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
          font: { size: 14 },
        },
        ticks: {
          font: { size: 12 },
        },
      },
      x: {
        title: {
          display: true,
          text: 'Age (months)',
          font: { size: 14 },
        },
        ticks: {
          font: { size: 12 },
        },
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">
        WHO {type === 'height' ? 'Height' : 'Weight'}-for-Age Standards ({gender === 'boy' ? 'Boys' : 'Girls'})
      </h2>
      <Line data={data} options={options} />
    </div>
  );
}
