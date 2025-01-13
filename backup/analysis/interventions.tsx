import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import { defaultChartOptions } from '../../utils/chartConfig';
import { Chart } from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';

Chart.register(annotationPlugin);

type InterventionData = {
  id: string;
  name: string;
  startDate: string;
  type: 'nutrition' | 'medical' | 'behavioral';
  description: string;
  impact: number;
};

// Mock data - replace with actual data from your API
const mockInterventions: InterventionData[] = [
  {
    id: '1',
    name: 'Nutrition Program A',
    startDate: '2024-06-01',
    type: 'nutrition',
    description: 'Supplementary feeding program',
    impact: 0.8,
  },
  {
    id: '2',
    name: 'Medical Checkup',
    startDate: '2024-07-15',
    type: 'medical',
    description: 'Regular health monitoring',
    impact: 0.5,
  },
  {
    id: '3',
    name: 'Behavioral Program',
    startDate: '2024-08-01',
    type: 'behavioral',
    description: 'Parent education program',
    impact: 0.6,
  },
];

const InterventionsAnalysis = () => {
  const [selectedType, setSelectedType] = useState<'all' | 'nutrition' | 'medical' | 'behavioral'>('all');

  // Filter interventions based on selected type
  const filteredInterventions = selectedType === 'all' 
    ? mockInterventions 
    : mockInterventions.filter(i => i.type === selectedType);

  // Prepare chart data
  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Growth Rate',
        data: [65, 66, 67, 68, 70, 72, 73, 75, 76, 77, 78, 79],
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 2,
        fill: false,
        tension: 0.4,
      },
      {
        label: 'Expected Growth',
        data: [65, 66.5, 68, 69.5, 71, 72.5, 74, 75.5, 77, 78.5, 80, 81.5],
        borderColor: 'rgba(0, 0, 0, 0.2)',
        borderWidth: 1,
        borderDash: [5, 5],
        fill: false,
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    ...defaultChartOptions,
    scales: {
      ...defaultChartOptions.scales,
      x: {
        ...defaultChartOptions.scales?.x,
        type: 'category' as const,
      }
    },
    plugins: {
      ...defaultChartOptions.plugins,
      annotation: {
        common: {
          drawTime: 'afterDraw',
        },
        annotations: filteredInterventions.map((intervention, index) => ({
          type: 'line' as const,
          xMin: new Date(intervention.startDate).getMonth(),
          xMax: new Date(intervention.startDate).getMonth(),
          borderColor: intervention.type === 'nutrition' ? 'rgba(34, 197, 94, 0.5)' :
                      intervention.type === 'medical' ? 'rgba(59, 130, 246, 0.5)' :
                      'rgba(234, 179, 8, 0.5)',
          borderWidth: 2,
          label: {
            display: true,
            content: intervention.name,
            position: 'start',
          },
        })),
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Intervention Impact Analysis</h1>
          <p className="mt-2 text-gray-600">
            Analyze the effectiveness of different interventions on child growth
          </p>
        </div>

        {/* Filter Controls */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Filter by Intervention Type
          </label>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as typeof selectedType)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="all">All Interventions</option>
            <option value="nutrition">Nutrition</option>
            <option value="medical">Medical</option>
            <option value="behavioral">Behavioral</option>
          </select>
        </div>

        {/* Growth Chart with Interventions */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Growth Trajectory & Interventions</h2>
          <div className="h-[400px]">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>

        {/* Interventions List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h2 className="text-xl font-semibold">Intervention Details</h2>
          </div>
          <div className="divide-y">
            {filteredInterventions.map((intervention) => (
              <div key={intervention.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{intervention.name}</h3>
                    <p className="mt-1 text-sm text-gray-600">{intervention.description}</p>
                  </div>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      intervention.type === 'nutrition'
                        ? 'bg-green-100 text-green-800'
                        : intervention.type === 'medical'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {intervention.type}
                  </span>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Start Date</p>
                    <p className="mt-1 font-medium">
                      {new Date(intervention.startDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Impact Score</p>
                    <div className="mt-1">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${intervention.impact * 100}%` }}
                        />
                      </div>
                      <p className="mt-1 font-medium">{(intervention.impact * 100).toFixed(0)}%</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterventionsAnalysis;
