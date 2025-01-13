import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Intervention, GrowthMeasurement } from '../../types/interventions';
import { calculateGrowthVelocity, calculateEffectSize } from '../../utils/statistics';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface InterventionComparisonProps {
  interventions: Intervention[];
  measurements: GrowthMeasurement[];
}

export default function InterventionComparison({
  interventions,
  measurements,
}: InterventionComparisonProps) {
  const [selectedMetric, setSelectedMetric] = useState<'height' | 'weight'>('height');
  const [comparisonType, setComparisonType] = useState<'velocity' | 'effect'>('velocity');

  const getInterventionData = (intervention: Intervention) => {
    const startDate = new Date(intervention.startDate);
    const endDate = new Date(intervention.endDate);

    const preMeasurements = measurements.filter(m => new Date(m.date) < startDate);
    const duringMeasurements = measurements.filter(
      m => {
        const date = new Date(m.date);
        return date >= startDate && date <= endDate;
      }
    );

    const velocity = calculateGrowthVelocity(duringMeasurements, selectedMetric);
    const effectSize = calculateEffectSize(
      preMeasurements.map(m => selectedMetric === 'height' ? m.height : m.weight),
      duringMeasurements.map(m => selectedMetric === 'height' ? m.height : m.weight)
    );

    return {
      velocity,
      effectSize: effectSize.cohensD,
    };
  };

  const chartData = {
    labels: interventions.map(i => i.type),
    datasets: [
      {
        label: comparisonType === 'velocity' 
          ? `${selectedMetric === 'height' ? 'Height (cm/month)' : 'Weight (kg/month)'} Velocity`
          : 'Effect Size (Cohen\'s d)',
        data: interventions.map(i => {
          const data = getInterventionData(i);
          return comparisonType === 'velocity' ? data.velocity : data.effectSize;
        }),
        backgroundColor: interventions.map((_, index) => 
          `hsla(${index * (360 / interventions.length)}, 70%, 50%, 0.8)`
        ),
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Intervention Comparison',
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const value = context.parsed.y;
            if (comparisonType === 'velocity') {
              const unit = selectedMetric === 'height' ? 'cm/month' : 'kg/month';
              return `Growth Rate: ${value.toFixed(2)} ${unit}`;
            } else {
              let interpretation = '';
              if (value < 0.2) interpretation = 'negligible effect';
              else if (value < 0.5) interpretation = 'small effect';
              else if (value < 0.8) interpretation = 'medium effect';
              else interpretation = 'large effect';
              return [
                `Effect Size: ${value.toFixed(2)}`,
                `Interpretation: ${interpretation}`,
              ];
            }
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: comparisonType === 'velocity'
            ? `Growth Rate (${selectedMetric === 'height' ? 'cm/month' : 'kg/month'})`
            : 'Effect Size (Cohen\'s d)',
        },
      },
    },
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Intervention Comparison</h3>
        <div className="flex space-x-4">
          <select
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value as 'height' | 'weight')}
            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="height">Height</option>
            <option value="weight">Weight</option>
          </select>
          <select
            value={comparisonType}
            onChange={(e) => setComparisonType(e.target.value as 'velocity' | 'effect')}
            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="velocity">Growth Rate</option>
            <option value="effect">Effect Size</option>
          </select>
        </div>
      </div>

      <Bar options={options} data={chartData} />

      {/* Summary Table */}
      <div className="mt-6">
        <h4 className="font-medium mb-4">Detailed Comparison</h4>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Intervention
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Growth Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Effect Size
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Interpretation
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {interventions.map((intervention) => {
                const data = getInterventionData(intervention);
                let interpretation = '';
                if (data.effectSize < 0.2) interpretation = 'Negligible effect';
                else if (data.effectSize < 0.5) interpretation = 'Small effect';
                else if (data.effectSize < 0.8) interpretation = 'Medium effect';
                else interpretation = 'Large effect';

                return (
                  <tr key={intervention.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {intervention.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {data.velocity.toFixed(2)} {selectedMetric === 'height' ? 'cm/month' : 'kg/month'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {data.effectSize.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {interpretation}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
