import React from 'react';
import Layout from '../components/layout/Layout';
import WHOGrowthChart from '../components/charts/WHOGrowthChart';
import TrendAnalysis from '../components/charts/TrendAnalysis';

// Mock data - replace with real data from your database
const mockChildren = [
  {
    id: '1',
    name: 'John D.',
    measurements: [
      { date: '2023-01-15', age: 0, height: 50, weight: 3.5 },
      { date: '2023-04-15', age: 3, height: 61, weight: 6.0 },
      { date: '2023-07-15', age: 6, height: 67, weight: 7.8 },
      { date: '2023-10-15', age: 9, height: 72, weight: 9.2 },
      { date: '2024-01-15', age: 12, height: 76, weight: 10.5 },
    ],
  },
  {
    id: '2',
    name: 'Sarah M.',
    measurements: [
      { date: '2023-01-15', age: 0, height: 49, weight: 3.3 },
      { date: '2023-04-15', age: 3, height: 59, weight: 5.8 },
      { date: '2023-07-15', age: 6, height: 65, weight: 7.5 },
      { date: '2023-10-15', age: 9, height: 70, weight: 8.9 },
      { date: '2024-01-15', age: 12, height: 74, weight: 10.2 },
    ],
  },
];

export default function Visualizations() {
  return (
    <Layout>
      <div className="space-y-8 p-6">
        <h1 className="text-3xl font-bold">Growth Visualizations</h1>
        
        {/* WHO Growth Standards */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">WHO Growth Standards</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Height Standards */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Height-for-Age</h3>
              <div className="space-y-6">
                <WHOGrowthChart type="height" gender="boy" />
                <WHOGrowthChart type="height" gender="girl" />
              </div>
            </div>

            {/* Weight Standards */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Weight-for-Age</h3>
              <div className="space-y-6">
                <WHOGrowthChart type="weight" gender="boy" />
                <WHOGrowthChart type="weight" gender="girl" />
              </div>
            </div>
          </div>
        </div>

        {/* Trend Analysis */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Growth Trends</h2>
          <div className="grid grid-cols-1 gap-6">
            <TrendAnalysis children={mockChildren} type="height" />
            <TrendAnalysis children={mockChildren} type="weight" />
          </div>
        </div>
      </div>
    </Layout>
  );
}
