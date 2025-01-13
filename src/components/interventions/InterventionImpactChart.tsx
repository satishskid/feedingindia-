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
  ChartOptions,
} from 'chart.js';
import { GrowthMeasurement, Intervention } from '../../types/interventions';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface InterventionImpactChartProps {
  measurements: GrowthMeasurement[];
  interventions: Intervention[];
  type: 'height' | 'weight';
}

export default function InterventionImpactChart({
  measurements,
  interventions,
  type,
}: InterventionImpactChartProps) {
  // Sort measurements by date
  const sortedMeasurements = [...measurements].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Create datasets for pre, during, and post intervention periods
  const datasets = interventions.map((intervention) => {
    const interventionStart = new Date(intervention.startDate);
    const interventionEnd = new Date(intervention.endDate);

    const preMeasurements = sortedMeasurements.filter(
      (m) => new Date(m.date) < interventionStart
    );
    const duringMeasurements = sortedMeasurements.filter(
      (m) => {
        const date = new Date(m.date);
        return date >= interventionStart && date <= interventionEnd;
      }
    );
    const postMeasurements = sortedMeasurements.filter(
      (m) => new Date(m.date) > interventionEnd
    );

    return [
      {
        label: `Pre-${intervention.type}`,
        data: preMeasurements.map((m) => ({
          x: m.age,
          y: type === 'height' ? m.height : m.weight,
        })),
        borderColor: 'rgba(75, 192, 192, 0.8)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        segment: {
          borderDash: [5, 5],
        },
      },
      {
        label: `During-${intervention.type}`,
        data: duringMeasurements.map((m) => ({
          x: m.age,
          y: type === 'height' ? m.height : m.weight,
        })),
        borderColor: 'rgba(255, 99, 132, 0.8)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderWidth: 2,
      },
      {
        label: `Post-${intervention.type}`,
        data: postMeasurements.map((m) => ({
          x: m.age,
          y: type === 'height' ? m.height : m.weight,
        })),
        borderColor: 'rgba(54, 162, 235, 0.8)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        segment: {
          borderDash: [5, 5],
        },
      },
    ];
  }).flat();

  const options: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.parsed.y;
            const unit = type === 'height' ? 'cm' : 'kg';
            return `${context.dataset.label}: ${value} ${unit}`;
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Age (months)',
        },
      },
      y: {
        title: {
          display: true,
          text: type === 'height' ? 'Height (cm)' : 'Weight (kg)',
        },
      },
    },
  };

  const data = {
    datasets,
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">
        {type === 'height' ? 'Height' : 'Weight'} Growth with Interventions
      </h2>
      <Line options={options} data={data} />
    </div>
  );
}
