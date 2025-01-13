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
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            font: {
              size: 11
            }
          }
        }))
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Interventions Analysis</h1>
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value as typeof selectedType)}
          className="rounded-lg border-gray-300 shadow-sm"
        >
          <option value="all">All Interventions</option>
          <option value="nutrition">Nutrition</option>
          <option value="medical">Medical</option>
          <option value="behavioral">Behavioral</option>
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {filteredInterventions.map((intervention) => (
          <div key={intervention.id} className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold">{intervention.name}</h3>
              <span className={`px-2 py-1 rounded-full text-xs ${
                intervention.type === 'nutrition' ? 'bg-green-100 text-green-800' :
                intervention.type === 'medical' ? 'bg-blue-100 text-blue-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {intervention.type}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-2">{intervention.description}</p>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Started: {new Date(intervention.startDate).toLocaleDateString()}</span>
              <span className="text-gray-500">Impact: {(intervention.impact * 100).toFixed(0)}%</span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Growth Trajectory Analysis</h2>
        <div className="h-[400px]">
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Impact Analysis</h2>
        <div className="space-y-4">
          <p className="text-gray-600">
            This analysis shows the relationship between interventions and growth patterns.
            Vertical lines on the graph indicate when interventions were started.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-700 mb-2">Key Findings</h3>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                <li>Positive growth trend after nutrition intervention</li>
                <li>Consistent improvement in growth velocity</li>
                <li>Better than expected outcomes in recent months</li>
              </ul>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-700 mb-2">Recommendations</h3>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                <li>Continue current nutrition program</li>
                <li>Schedule follow-up medical assessment</li>
                <li>Monitor growth velocity monthly</li>
              </ul>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-700 mb-2">Next Steps</h3>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                <li>Review intervention effectiveness</li>
                <li>Adjust programs based on response</li>
                <li>Plan future interventions if needed</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterventionsAnalysis;
