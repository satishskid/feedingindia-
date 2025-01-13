import React, { useState } from 'react';
import WhoStandardsChart from '../../components/visualizations/WhoStandardsChart';

type Gender = 'boys' | 'girls';

export default function Visualizations() {
  const [selectedGender, setSelectedGender] = useState<Gender>('boys');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">WHO Growth Standards</h1>
        <select
          value={selectedGender}
          onChange={(e) => setSelectedGender(e.target.value as Gender)}
          className="rounded-lg border-gray-300 shadow-sm"
        >
          <option value="boys">Boys</option>
          <option value="girls">Girls</option>
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WhoStandardsChart type="height" gender={selectedGender} />
        <WhoStandardsChart type="weight" gender={selectedGender} />
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">About WHO Growth Standards</h2>
        <p className="text-gray-600">
          The WHO Child Growth Standards provide a scientifically robust tool to assess the growth 
          and development of children worldwide. These standards demonstrate how children should grow 
          under optimal environmental conditions, regardless of ethnicity or geography.
        </p>
        <div className="mt-4 space-y-2">
          <p className="text-sm text-gray-500">
            <span className="font-medium">Percentile Lines:</span>
          </p>
          <ul className="list-disc list-inside text-sm text-gray-500 ml-4 space-y-1">
            <li>The <span className="font-medium">50th percentile (median)</span> represents the middle value</li>
            <li>The <span className="font-medium">97th percentile</span> indicates values above which only 3% of children measure</li>
            <li>The <span className="font-medium">85th percentile</span> is often used as a threshold for monitoring</li>
            <li>The <span className="font-medium">15th percentile</span> helps identify children who may need attention</li>
            <li>The <span className="font-medium">3rd percentile</span> may indicate need for intervention</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
