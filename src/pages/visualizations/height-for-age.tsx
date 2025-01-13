import React, { useState } from 'react';
import WhoStandardsChart from '../../components/visualizations/WhoStandardsChart';

type Gender = 'boys' | 'girls';

export default function HeightForAge() {
  const [selectedGender, setSelectedGender] = useState<Gender>('boys');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Height-for-Age Standards</h1>
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
        <WhoStandardsChart type="height" gender={selectedGender} />
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Understanding Height-for-Age</h2>
        <p className="text-gray-600 mb-4">
          Height-for-age is a measure used to assess linear growth and identify stunting or 
          tall stature in children. It compares a child's height with the expected height 
          of a healthy child of the same age and sex.
        </p>
        <div className="space-y-3">
          <h3 className="font-medium text-gray-700">Interpreting the Percentiles:</h3>
          <ul className="list-disc list-inside text-sm text-gray-600 space-y-2 ml-4">
            <li><span className="font-medium">Above 97th percentile:</span> May indicate tall stature</li>
            <li><span className="font-medium">Between 85th-97th:</span> Above average height</li>
            <li><span className="font-medium">Between 15th-85th:</span> Normal height range</li>
            <li><span className="font-medium">Between 3rd-15th:</span> Below average height</li>
            <li><span className="font-medium">Below 3rd percentile:</span> May indicate stunting</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
