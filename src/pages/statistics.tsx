import React from 'react';
import Layout from '../components/layout/Layout';

export default function Statistics() {
  const stats = [
    { name: 'Total Children', value: '42' },
    { name: 'Average Height', value: '89 cm' },
    { name: 'Average Weight', value: '12.5 kg' },
    { name: 'Boys', value: '24' },
    { name: 'Girls', value: '18' },
    { name: 'Age Range', value: '0-60 months' },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Statistics</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((stat) => (
            <div
              key={stat.name}
              className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg"
            >
              <div className="px-4 py-5 sm:p-6">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                  {stat.name}
                </dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">
                  {stat.value}
                </dd>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mt-6">
          <h2 className="text-xl font-bold mb-4">Growth Trends</h2>
          <p className="text-gray-600 dark:text-gray-300">
            Detailed statistical analysis and trends will be displayed here.
          </p>
        </div>
      </div>
    </Layout>
  );
}
