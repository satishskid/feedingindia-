import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/layout/Layout';
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
import { Child, Intervention } from '../../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Mock data - replace with API call
const childData: Child = {
  id: '1',
  name: 'John Doe',
  birthDate: '2023-01-15',
  gender: 'boy',
  image: '/child-image.jpg',
  programId: 'prog1',
  measurements: [
    { date: '2023-01-15', age: 0, height: 50, weight: 3.5 },
    { date: '2023-02-15', age: 1, height: 54, weight: 4.2 },
    { date: '2023-03-15', age: 2, height: 58, weight: 5.1 },
    { date: '2023-04-15', age: 3, height: 61, weight: 5.8 },
  ],
  interventions: [
    {
      id: 'int1',
      date: '2023-02-01',
      type: 'Nutrition',
      description: 'Started supplementary feeding program',
      status: 'Completed',
      outcome: 'Weight gain of 0.7kg over 2 weeks',
      nextFollowUp: '2023-02-15'
    },
    {
      id: 'int2',
      date: '2023-03-01',
      type: 'Medical',
      description: 'Vitamin A supplementation',
      status: 'Completed',
      nextFollowUp: '2023-09-01'
    }
  ]
};

const ChildDetails = () => {
  const router = useRouter();
  const { id } = router.query;
  const [whoData, setWhoData] = useState<WHOData | null>(null);
  const [newIntervention, setNewIntervention] = useState<Partial<Intervention>>({
    type: 'Nutrition',
    status: 'Planned'
  });
  const [showInterventionForm, setShowInterventionForm] = useState(false);

  useEffect(() => {
    loadWHOData().then(setWhoData);
  }, []);

  const getStandardsDataset = (standards: WHOStandard[], label: string, color: string) => ({
    label,
    data: standards.map(s => s.SD0),
    borderColor: color,
    backgroundColor: color,
    borderDash: [5, 5],
    pointRadius: 0,
    borderWidth: 1,
  });

  const heightChartData = {
    labels: childData.measurements.map(m => m.age),
    datasets: [
      {
        label: 'Height',
        data: childData.measurements.map(m => m.height),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        tension: 0.1,
      },
      ...(whoData ? [
        getStandardsDataset(whoData.heightBoys, 'WHO Median', 'rgba(0, 0, 0, 0.5)'),
        {
          label: '+2 SD',
          data: whoData.heightBoys.map(s => s.SD2),
          borderColor: 'rgba(255, 99, 132, 0.5)',
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
          borderDash: [5, 5],
          pointRadius: 0,
          borderWidth: 1,
        },
        {
          label: '-2 SD',
          data: whoData.heightBoys.map(s => s.SD2neg),
          borderColor: 'rgba(54, 162, 235, 0.5)',
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          borderDash: [5, 5],
          pointRadius: 0,
          borderWidth: 1,
        },
      ] : []),
    ],
  };

  const weightChartData = {
    labels: childData.measurements.map(m => m.age),
    datasets: [
      {
        label: 'Weight',
        data: childData.measurements.map(m => m.weight),
        borderColor: 'rgb(153, 102, 255)',
        backgroundColor: 'rgba(153, 102, 255, 0.5)',
        tension: 0.1,
      },
      ...(whoData ? [
        getStandardsDataset(whoData.weightBoys, 'WHO Median', 'rgba(0, 0, 0, 0.5)'),
        {
          label: '+2 SD',
          data: whoData.weightBoys.map(s => s.SD2),
          borderColor: 'rgba(255, 99, 132, 0.5)',
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
          borderDash: [5, 5],
          pointRadius: 0,
          borderWidth: 1,
        },
        {
          label: '-2 SD',
          data: whoData.weightBoys.map(s => s.SD2neg),
          borderColor: 'rgba(54, 162, 235, 0.5)',
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          borderDash: [5, 5],
          pointRadius: 0,
          borderWidth: 1,
        },
      ] : []),
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 2,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: { size: 14 },
        },
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const value = context.parsed.y;
            const datasetLabel = context.dataset.label;
            if (datasetLabel === 'Height') {
              return `${datasetLabel}: ${value} cm`;
            }
            if (datasetLabel === 'Weight') {
              return `${datasetLabel}: ${value} kg`;
            }
            return `${datasetLabel}: ${value}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          font: { size: 12 },
          callback: (value: number, index: number, values: any[]) => {
            return value.toFixed(1);
          },
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

  const handleInterventionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add API call to save intervention
    console.log('New intervention:', newIntervention);
    setShowInterventionForm(false);
    setNewIntervention({ type: 'Nutrition', status: 'Planned' });
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Child Info Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl shadow-2xl p-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8">
            <div className="space-y-6">
              <div className="flex items-center space-x-6">
                <div className="w-32 h-32 rounded-xl overflow-hidden bg-white/20">
                  <img
                    src={childData.image || '/placeholder-child.png'}
                    alt={childData.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-white mb-2">{childData.name}</h1>
                  <div className="space-y-1">
                    <p className="text-lg text-purple-100">
                      <span className="font-medium">Born:</span> {childData.birthDate}
                    </p>
                    <p className="text-lg text-purple-100">
                      <span className="font-medium">Gender:</span> {childData.gender}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white/20 backdrop-blur-lg rounded-xl p-6 min-w-[200px]">
              <p className="text-lg font-medium text-white mb-1">Current Age</p>
              <p className="text-4xl font-bold text-white">12 months</p>
            </div>
          </div>
        </div>

        {/* Latest Measurements */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400">Latest Height</h3>
              <p className="text-4xl font-bold text-gray-900 dark:text-white">76 cm</p>
              <p className="text-lg text-green-500">↑ 4cm from last measurement</p>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400">Latest Weight</h3>
              <p className="text-4xl font-bold text-gray-900 dark:text-white">10.5 kg</p>
              <p className="text-lg text-green-500">↑ 1.3kg from last measurement</p>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400">BMI</h3>
              <p className="text-4xl font-bold text-gray-900 dark:text-white">18.2</p>
              <p className="text-lg text-blue-500">Normal range</p>
            </div>
          </div>
        </div>

        {/* Growth Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Height-for-Age</h2>
            <Line data={heightChartData} options={chartOptions} />
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Weight-for-Age</h2>
            <Line data={weightChartData} options={chartOptions} />
          </div>
        </div>

        {/* Interventions Section */}
        <div className="bg-white rounded-lg shadow-xl p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Interventions</h2>
            <button
              onClick={() => setShowInterventionForm(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              Add Intervention
            </button>
          </div>

          {showInterventionForm && (
            <div className="mb-6 bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">New Intervention</h3>
              <form onSubmit={handleInterventionSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Type</label>
                  <select
                    value={newIntervention.type}
                    onChange={(e) => setNewIntervention({...newIntervention, type: e.target.value as Intervention['type']})}
                    className="w-full rounded-md border-gray-300 shadow-sm"
                  >
                    <option value="Nutrition">Nutrition</option>
                    <option value="Medical">Medical</option>
                    <option value="Educational">Educational</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    value={newIntervention.description || ''}
                    onChange={(e) => setNewIntervention({...newIntervention, description: e.target.value})}
                    className="w-full rounded-md border-gray-300 shadow-sm"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Status</label>
                  <select
                    value={newIntervention.status}
                    onChange={(e) => setNewIntervention({...newIntervention, status: e.target.value as Intervention['status']})}
                    className="w-full rounded-md border-gray-300 shadow-sm"
                  >
                    <option value="Planned">Planned</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Next Follow-up</label>
                  <input
                    type="date"
                    value={newIntervention.nextFollowUp || ''}
                    onChange={(e) => setNewIntervention({...newIntervention, nextFollowUp: e.target.value})}
                    className="w-full rounded-md border-gray-300 shadow-sm"
                  />
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowInterventionForm(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                  >
                    Save Intervention
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="space-y-4">
            {childData.interventions.map((intervention) => (
              <div
                key={intervention.id}
                className="border rounded-lg p-4 hover:bg-gray-50"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold">{intervention.type}</h4>
                    <p className="text-gray-600">{intervention.description}</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-sm ${
                    intervention.status === 'Completed' ? 'bg-green-100 text-green-800' :
                    intervention.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {intervention.status}
                  </span>
                </div>
                <div className="mt-2 text-sm text-gray-500">
                  <p>Date: {new Date(intervention.date).toLocaleDateString()}</p>
                  {intervention.outcome && (
                    <p className="mt-1">Outcome: {intervention.outcome}</p>
                  )}
                  {intervention.nextFollowUp && (
                    <p className="mt-1">Next Follow-up: {new Date(intervention.nextFollowUp).toLocaleDateString()}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Measurement History */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Measurement History</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Age (months)</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Height (cm)</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Weight (kg)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {childData.measurements.map((measurement, index) => (
                  <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-base text-gray-900 dark:text-white">{measurement.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-base text-gray-500 dark:text-gray-400">{measurement.age}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-base text-gray-500 dark:text-gray-400">{measurement.height}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-base text-gray-500 dark:text-gray-400">{measurement.weight}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ChildDetails;
