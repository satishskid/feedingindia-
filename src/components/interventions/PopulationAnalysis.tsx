import React, { useState, useMemo, useEffect } from 'react';
import {
  generateMockChildren,
  getChildrenByIntervention,
  getGrowthVelocities,
  mockWHOStandards
} from '../../data/mockChildrenData';
import AdvancedVisualization from './AdvancedVisualization';
import { Line, Bar } from 'react-chartjs-2';
import {
  calculateANOVA,
  calculateSeasonalEffects,
  calculateCatchUpIndex
} from '../../utils/advancedStatistics';
import { exportReport } from '../../utils/reportExport';
import '../../utils/chartConfig';

interface PopulationStats {
  mean: number;
  median: number;
  min: number;
  max: number;
  count: number;
}

export default function PopulationAnalysis() {
  const [mockChildren, setMockChildren] = useState<any[]>([]);
  const [selectedIntervention, setSelectedIntervention] = useState<string>('all');
  const [selectedMetric, setSelectedMetric] = useState<'height' | 'weight'>('height');
  const [selectedAnalysis, setSelectedAnalysis] = useState<string>('growth');
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<string>('all');
  const [showOutliers, setShowOutliers] = useState<boolean>(false);

  useEffect(() => {
    // Generate mock data on client side only
    setMockChildren(generateMockChildren());
  }, []);

  const childrenByIntervention = useMemo(() => 
    getChildrenByIntervention(mockChildren),
    [mockChildren]
  );

  const growthVelocities = useMemo(() => 
    getGrowthVelocities(childrenByIntervention),
    [childrenByIntervention]
  );

  // Filter children based on selected criteria
  const filteredChildren = useMemo(() => {
    if (!mockChildren.length) return [];
    
    let filtered = [...mockChildren];

    // Filter by intervention
    if (selectedIntervention !== 'all') {
      filtered = filtered.filter(child =>
        child.interventions.some(i => i.type === selectedIntervention)
      );
    }

    // Filter by age group
    if (selectedAgeGroup !== 'all') {
      const [minAge, maxAge] = selectedAgeGroup.split('-').map(Number);
      filtered = filtered.filter(child => {
        const lastMeasurement = child.measurements[child.measurements.length - 1];
        return lastMeasurement.age >= minAge && lastMeasurement.age <= maxAge;
      });
    }

    // Filter outliers if needed
    if (!showOutliers) {
      const measurements = filtered.flatMap(c => c.measurements);
      const values = measurements.map(m => m[selectedMetric]);
      const mean = values.reduce((a, b) => a + b, 0) / values.length;
      const std = Math.sqrt(
        values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length
      );

      filtered = filtered.filter(child => {
        const childValues = child.measurements.map(m => m[selectedMetric]);
        return childValues.every(v => Math.abs(v - mean) <= 2 * std);
      });
    }

    return filtered;
  }, [selectedIntervention, selectedAgeGroup, showOutliers, selectedMetric, mockChildren]);

  // Calculate statistics for the filtered population
  const populationStats = useMemo<PopulationStats>(() => {
    if (!filteredChildren.length) {
      return {
        mean: 0,
        median: 0,
        min: 0,
        max: 0,
        count: 0
      };
    }

    const measurements = filteredChildren.flatMap(c => c.measurements);
    const values = measurements.map(m => m[selectedMetric]);
    const sortedValues = [...values].sort((a, b) => a - b);
    
    return {
      mean: values.reduce((a, b) => a + b, 0) / values.length,
      median: sortedValues[Math.floor(sortedValues.length / 2)],
      min: sortedValues[0],
      max: sortedValues[sortedValues.length - 1],
      count: filteredChildren.length
    };
  }, [filteredChildren, selectedMetric]);

  // Prepare data for growth trajectory chart
  const growthData = {
    labels: ['0', '6', '12', '18', '24'],
    datasets: [
      // Control group
      {
        label: 'Control Group',
        data: childrenByIntervention.control.map(child =>
          child.measurements.map(m => m[selectedMetric])
        ).reduce((acc, curr) => curr.map((val, i) => (acc[i] || 0) + val), [])
          .map(sum => sum / childrenByIntervention.control.length),
        borderColor: 'rgb(75, 192, 192)',
        fill: false
      },
      // Intervention groups
      ...Object.entries(childrenByIntervention)
        .filter(([key]) => key !== 'control')
        .map(([key, children], index) => ({
          label: key.charAt(0).toUpperCase() + key.slice(1),
          data: children.map(child =>
            child.measurements.map(m => m[selectedMetric])
          ).reduce((acc, curr) => curr.map((val, i) => (acc[i] || 0) + val), [])
            .map(sum => sum / children.length),
          borderColor: [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
            'rgb(255, 206, 86)'
          ][index],
          fill: false
        }))
    ]
  };

  // Prepare data for intervention comparison chart
  const comparisonData = {
    labels: Object.keys(growthVelocities),
    datasets: [{
      label: `Average ${selectedMetric} velocity`,
      data: Object.values(growthVelocities).map(v => v[selectedMetric]),
      backgroundColor: [
        'rgba(75, 192, 192, 0.5)',
        'rgba(255, 99, 132, 0.5)',
        'rgba(54, 162, 235, 0.5)',
        'rgba(255, 206, 86, 0.5)'
      ]
    }]
  };

  // Handle report export
  const handleExport = async (format: 'pdf' | 'csv' | 'excel') => {
    const options = {
      format,
      includeCharts: true,
      includeStatistics: true,
      includeRawData: true
    };

    try {
      const report = await exportReport(
        filteredChildren[0].interventions[0],
        filteredChildren[0].measurements,
        mockWHOStandards,
        options
      );

      // Create download link
      const url = window.URL.createObjectURL(new Blob([report]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `population-analysis-${format}.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error exporting report:', error);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4">Population Analysis</h2>
        
        {/* Controls */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <select
            value={selectedIntervention}
            onChange={(e) => setSelectedIntervention(e.target.value)}
            className="rounded-md border-gray-300"
          >
            <option value="all">All Interventions</option>
            <option value="nutrition">Nutrition</option>
            <option value="deworming">Deworming</option>
            <option value="vitamin_supplementation">Vitamin Supplementation</option>
          </select>

          <select
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value as 'height' | 'weight')}
            className="rounded-md border-gray-300"
          >
            <option value="height">Height</option>
            <option value="weight">Weight</option>
          </select>

          <select
            value={selectedAnalysis}
            onChange={(e) => setSelectedAnalysis(e.target.value)}
            className="rounded-md border-gray-300"
          >
            <option value="growth">Growth Trajectories</option>
            <option value="comparison">Intervention Comparison</option>
            <option value="seasonal">Seasonal Effects</option>
          </select>

          <select
            value={selectedAgeGroup}
            onChange={(e) => setSelectedAgeGroup(e.target.value)}
            className="rounded-md border-gray-300"
          >
            <option value="all">All Ages</option>
            <option value="0-6">0-6 months</option>
            <option value="6-12">6-12 months</option>
            <option value="12-18">12-18 months</option>
            <option value="18-24">18-24 months</option>
          </select>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={showOutliers}
              onChange={(e) => setShowOutliers(e.target.checked)}
              className="rounded border-gray-300"
            />
            <span>Show Outliers</span>
          </label>
        </div>

        {/* Statistics Summary */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6 bg-gray-50 p-4 rounded-lg">
          <div>
            <div className="text-sm text-gray-500">Population Size</div>
            <div className="text-lg font-semibold">{populationStats.count}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Mean</div>
            <div className="text-lg font-semibold">
              {populationStats.mean.toFixed(2)}
              {selectedMetric === 'height' ? ' cm' : ' kg'}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Median</div>
            <div className="text-lg font-semibold">
              {populationStats.median.toFixed(2)}
              {selectedMetric === 'height' ? ' cm' : ' kg'}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Range</div>
            <div className="text-lg font-semibold">
              {(populationStats.max - populationStats.min).toFixed(2)}
              {selectedMetric === 'height' ? ' cm' : ' kg'}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Intervention Coverage</div>
            <div className="text-lg font-semibold">
              {((filteredChildren.filter(c => c.interventions.length > 0).length / 
                filteredChildren.length) * 100).toFixed(1)}%
            </div>
          </div>
        </div>

        {/* Visualization */}
        <div className="h-96 mb-6">
          {selectedAnalysis === 'growth' && (
            <Line data={growthData} options={{
              responsive: true,
              plugins: {
                title: {
                  display: true,
                  text: 'Growth Trajectories by Intervention Type'
                }
              }
            }} />
          )}
          {selectedAnalysis === 'comparison' && (
            <Bar data={comparisonData} options={{
              responsive: true,
              plugins: {
                title: {
                  display: true,
                  text: 'Intervention Comparison'
                }
              }
            }} />
          )}
          {selectedAnalysis === 'seasonal' && (
            <AdvancedVisualization
              measurements={filteredChildren[0].measurements}
              interventions={filteredChildren[0].interventions}
              whoStandards={mockWHOStandards}
            />
          )}
        </div>

        {/* Export Controls */}
        <div className="flex space-x-4">
          <button
            onClick={() => handleExport('pdf')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Export PDF
          </button>
          <button
            onClick={() => handleExport('csv')}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Export CSV
          </button>
          <button
            onClick={() => handleExport('excel')}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            Export Excel
          </button>
        </div>
      </div>
    </div>
  );
}
