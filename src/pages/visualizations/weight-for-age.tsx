import React, { useState } from 'react';
import WhoStandardsChart from '../../components/visualizations/WhoStandardsChart';

type Gender = 'boys' | 'girls';

export default function WeightForAge() {
  const [selectedGender, setSelectedGender] = useState<Gender>('boys');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Weight-for-Age Standards</h1>
        <select
          value={selectedGender}
          onChange={(e) => setSelectedGender(e.target.value as Gender)}
          className="rounded-lg border-gray-300 shadow-sm"
        >
          <option value="boys">Boys</option>
          <option value="girls">Girls</option>
        </select>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <WhoStandardsChart type="weight" gender={selectedGender} />
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Understanding Weight-for-Age</h2>
        <p className="text-gray-600 mb-4">
          Weight-for-age is a key indicator used to assess growth and nutritional status in children. 
          It helps identify underweight or overweight conditions by comparing a child's weight with 
          the expected weight of a healthy child of the same age and sex.
        </p>
        <div className="space-y-3">
          <h3 className="font-medium text-gray-700">Interpreting the Percentiles:</h3>
          <ul className="list-disc list-inside text-sm text-gray-600 space-y-2 ml-4">
            <li><span className="font-medium">Above 97th percentile:</span> May indicate overweight</li>
            <li><span className="font-medium">Between 85th-97th:</span> Above average weight</li>
            <li><span className="font-medium">Between 15th-85th:</span> Normal weight range</li>
            <li><span className="font-medium">Between 3rd-15th:</span> Below average weight</li>
            <li><span className="font-medium">Below 3rd percentile:</span> May indicate underweight</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
