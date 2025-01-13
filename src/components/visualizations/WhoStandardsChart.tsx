import React, { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import { defaultChartOptions } from '../../utils/chartConfig';

interface WhoStandardsChartProps {
  type: 'height' | 'weight';
  gender: 'boys' | 'girls';
}

// Move data generation outside component
const generateAgeLabels = () => {
  // Reduce number of data points for better performance
  return Array.from({ length: 73 }, (_, i) => (i * 3) + 61); // Every 3 months from 61 to 277
};

const generatePercentileData = (
  type: 'height' | 'weight',
  gender: 'boys' | 'girls',
  percentile: number,
  ageLabels: number[]
): number[] => {
  return ageLabels.map(age => {
    const baseValue = type === 'height' ? 100 : 20;
    const growthRate = type === 'height' ? 0.4 : 0.1;
    const genderFactor = gender === 'boys' ? 1.05 : 1;
    const percentileFactor = (percentile - 50) / 50;
    
    return (baseValue + age * growthRate) * genderFactor * (1 + percentileFactor * 0.2);
  });
};

const WhoStandardsChart: React.FC<WhoStandardsChartProps> = ({ type, gender }) => {
  // Memoize data generation
  const { ageLabels, chartData } = useMemo(() => {
    const labels = generateAgeLabels();
    const data = {
      labels,
      datasets: [
        {
          label: 'Median (50th percentile)',
          data: generatePercentileData(type, gender, 50, labels),
          borderColor: 'rgb(0, 0, 0)',
          borderWidth: 2,
          fill: false,
          tension: 0.4,
          pointRadius: 0,
        },
        {
          label: '97th percentile',
          data: generatePercentileData(type, gender, 97, labels),
          borderColor: 'rgba(239, 68, 68, 0.8)',
          borderWidth: 1.5,
          borderDash: [6, 4],
          fill: false,
          tension: 0.4,
          pointRadius: 0,
        },
        {
          label: '85th percentile',
          data: generatePercentileData(type, gender, 85, labels),
          borderColor: 'rgba(245, 158, 11, 0.8)',
          borderWidth: 1.5,
          borderDash: [6, 4],
          fill: false,
          tension: 0.4,
          pointRadius: 0,
        },
        {
          label: '15th percentile',
          data: generatePercentileData(type, gender, 15, labels),
          borderColor: 'rgba(59, 130, 246, 0.8)',
          borderWidth: 1.5,
          borderDash: [6, 4],
          fill: false,
          tension: 0.4,
          pointRadius: 0,
        },
        {
          label: '3rd percentile',
          data: generatePercentileData(type, gender, 3, labels),
          borderColor: 'rgba(37, 99, 235, 0.8)',
          borderWidth: 1.5,
          borderDash: [6, 4],
          fill: false,
          tension: 0.4,
          pointRadius: 0,
        },
      ],
    };
    return { ageLabels: labels, chartData: data };
  }, [type, gender]);

  // Memoize options
  const options = useMemo(() => ({
    ...defaultChartOptions,
    scales: {
      ...defaultChartOptions.scales,
      y: {
        ...defaultChartOptions.scales?.y,
        title: {
          ...defaultChartOptions.scales?.y?.title,
          text: type === 'height' ? 'Height (cm)' : 'Weight (kg)',
        }
      }
    }
  }), [type]);

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <h3 className="text-lg font-semibold mb-4">
        WHO {type === 'height' ? 'Height-for-Age' : 'Weight-for-Age'} Standards ({gender === 'boys' ? 'Boys' : 'Girls'})
      </h3>
      <div className="h-[400px]">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default React.memo(WhoStandardsChart);
