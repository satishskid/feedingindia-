import React, { useState } from 'react';
import {
  Line,
  Bar,
  Scatter,
  Bubble,
} from 'react-chartjs-2';
import type {
  ChartOptions
} from 'chart.js';
import { Intervention, GrowthMeasurement } from '../../types/interventions';
import {
  calculateGrowthAcceleration,
  calculateSeasonalEffects,
  calculateCatchUpIndex,
} from '../../utils/advancedStatistics';
import '../../utils/chartConfig';

interface AdvancedVisualizationProps {
  interventions: Intervention[];
  measurements: GrowthMeasurement[];
  whoStandards: any; // Replace with proper WHO standards type
}

type ChartType = 'growth' | 'velocity' | 'acceleration' | 'seasonal' | 'zscore' | 'catchup';

export default function AdvancedVisualization({
  interventions,
  measurements,
  whoStandards,
}: AdvancedVisualizationProps) {
  const [chartType, setChartType] = useState<ChartType>('growth');
  const [metric, setMetric] = useState<'height' | 'weight'>('height');
  const [showConfidenceIntervals, setShowConfidenceIntervals] = useState(false);

  // Growth Chart Data
  const growthData = {
    labels: measurements.map(m => new Date(m.date).toLocaleDateString()),
    datasets: [
      {
        label: `${metric === 'height' ? 'Height (cm)' : 'Weight (kg)'}`,
        data: measurements.map(m => metric === 'height' ? m.height : m.weight),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        tension: 0.4,
      },
      ...(showConfidenceIntervals ? [
        {
          label: 'Upper CI',
          data: measurements.map(m => (metric === 'height' ? m.height : m.weight) * 1.05),
          borderColor: 'rgba(75, 192, 192, 0.3)',
          backgroundColor: 'rgba(75, 192, 192, 0.1)',
          fill: 1,
        },
        {
          label: 'Lower CI',
          data: measurements.map(m => (metric === 'height' ? m.height : m.weight) * 0.95),
          borderColor: 'rgba(75, 192, 192, 0.3)',
          backgroundColor: 'rgba(75, 192, 192, 0.1)',
          fill: 'start',
        },
      ] : []),
    ],
  };

  // Velocity Chart Data
  const velocityData = {
    labels: measurements.slice(1).map(m => new Date(m.date).toLocaleDateString()),
    datasets: [{
      label: `${metric === 'height' ? 'Height' : 'Weight'} Velocity`,
      data: measurements.slice(1).map((m, i) => {
        const timeDiff = (new Date(m.date).getTime() - new Date(measurements[i].date).getTime()) / (1000 * 60 * 60 * 24 * 30.44);
        const valueDiff = metric === 'height' 
          ? m.height - measurements[i].height
          : m.weight - measurements[i].weight;
        return valueDiff / timeDiff;
      }),
      borderColor: 'rgb(255, 99, 132)',
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
    }],
  };

  // Acceleration Chart Data
  const accelerationData = {
    labels: measurements.slice(2).map(m => new Date(m.date).toLocaleDateString()),
    datasets: [{
      label: `${metric === 'height' ? 'Height' : 'Weight'} Acceleration`,
      data: measurements.slice(2).map((_, i) => {
        const subset = measurements.slice(i, i + 3);
        return calculateGrowthAcceleration(subset, metric);
      }),
      borderColor: 'rgb(54, 162, 235)',
      backgroundColor: 'rgba(54, 162, 235, 0.5)',
    }],
  };

  // Seasonal Effects Chart Data
  const seasonalEffects = calculateSeasonalEffects(measurements, metric);
  const seasonalData = {
    labels: ['Spring', 'Summer', 'Fall', 'Winter'],
    datasets: [{
      label: 'Seasonal Growth Rate',
      data: [
        seasonalEffects.springGrowth,
        seasonalEffects.summerGrowth,
        seasonalEffects.fallGrowth,
        seasonalEffects.winterGrowth,
      ],
      backgroundColor: [
        'rgba(75, 192, 192, 0.5)',
        'rgba(255, 99, 132, 0.5)',
        'rgba(255, 159, 64, 0.5)',
        'rgba(54, 162, 235, 0.5)',
      ],
    }],
  };

  // Z-Score Chart Data
  const zScoreData = {
    labels: measurements.map(m => new Date(m.date).toLocaleDateString()),
    datasets: [{
      label: 'Z-Score',
      data: measurements.map(m => calculateCatchUpIndex([m], whoStandards, metric)),
      borderColor: 'rgb(153, 102, 255)',
      backgroundColor: 'rgba(153, 102, 255, 0.5)',
    }],
  };

  // Catch-up Growth Chart Data
  const catchUpData = {
    labels: measurements.map(m => new Date(m.date).toLocaleDateString()),
    datasets: [{
      label: 'Catch-up Growth Index',
      data: measurements.map((_, i) => 
        calculateCatchUpIndex(measurements.slice(0, i + 1), whoStandards, metric)
      ),
      borderColor: 'rgb(255, 159, 64)',
      backgroundColor: 'rgba(255, 159, 64, 0.5)',
    }],
  };

  const getChartData = () => {
    switch (chartType) {
      case 'growth':
        return growthData;
      case 'velocity':
        return velocityData;
      case 'acceleration':
        return accelerationData;
      case 'seasonal':
        return seasonalData;
      case 'zscore':
        return zScoreData;
      case 'catchup':
        return catchUpData;
      default:
        return growthData;
    }
  };

  const getChartOptions = (): ChartOptions<any> => {
    const baseOptions: ChartOptions<any> = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top' as const,
        },
        tooltip: {
          mode: 'index',
          intersect: false,
        },
      },
      scales: {
        y: {
          beginAtZero: false,
        },
      },
    };

    if (chartType === 'seasonal') {
      return {
        ...baseOptions,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: `Growth Rate (${metric === 'height' ? 'cm' : 'kg'}/month)`,
            },
          },
        },
      };
    }

    return baseOptions;
  };

  const getChartComponent = () => {
    switch (chartType) {
      case 'seasonal':
        return Bar;
      default:
        return Line;
    }
  };

  const ChartComponent = getChartComponent();

  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Advanced Growth Visualization</h3>
        <div className="flex space-x-4">
          <select
            value={chartType}
            onChange={(e) => setChartType(e.target.value as ChartType)}
            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="growth">Growth Chart</option>
            <option value="velocity">Velocity Chart</option>
            <option value="acceleration">Acceleration Chart</option>
            <option value="seasonal">Seasonal Effects</option>
            <option value="zscore">Z-Score Tracking</option>
            <option value="catchup">Catch-up Growth</option>
          </select>
          <select
            value={metric}
            onChange={(e) => setMetric(e.target.value as 'height' | 'weight')}
            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="height">Height</option>
            <option value="weight">Weight</option>
          </select>
          {chartType === 'growth' && (
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={showConfidenceIntervals}
                onChange={(e) => setShowConfidenceIntervals(e.target.checked)}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-sm text-gray-600">Show Confidence Intervals</span>
            </label>
          )}
        </div>
      </div>

      <div className="h-96">
        <ChartComponent
          data={getChartData()}
          options={getChartOptions()}
        />
      </div>

      {/* Chart Description */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium mb-2">Chart Description</h4>
        <p className="text-gray-600">
          {chartType === 'growth' && 'Shows the actual growth trajectory with optional confidence intervals.'}
          {chartType === 'velocity' && 'Displays the rate of growth over time.'}
          {chartType === 'acceleration' && 'Shows how growth velocity changes over time.'}
          {chartType === 'seasonal' && 'Compares growth rates across different seasons.'}
          {chartType === 'zscore' && 'Tracks deviation from WHO standards over time.'}
          {chartType === 'catchup' && 'Measures catch-up growth relative to standard growth curves.'}
        </p>
      </div>
    </div>
  );
}
