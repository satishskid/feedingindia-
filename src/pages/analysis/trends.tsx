import React, { useState, useEffect } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import { generateMockChildren } from '../../data/mockChildrenData';
import { defaultChartOptions } from '../../utils/chartConfig';
import '../../utils/chartConfig';

type MetricType = 'height' | 'weight';
type TimeRange = '6m' | '1y' | '2y' | 'all';

export default function TrendsAnalysis() {
  const [selectedMetric, setSelectedMetric] = useState<MetricType>('height');
  const [timeRange, setTimeRange] = useState<TimeRange>('1y');
  const [chartData, setChartData] = useState<any>(null);
  const [distributionData, setDistributionData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      setLoading(true);
      const mockData = generateMockChildren();
      
      // Process data based on selected metric and time range
      const processedData = {
        labels: ['0m', '6m', '12m', '18m', '24m'],
        datasets: mockData.slice(0, 10).map((child, index) => ({
          label: child.name,
          data: child.measurements.map(m => selectedMetric === 'height' ? m.height : m.weight),
          borderColor: `hsl(${index * 36}, 70%, 50%)`,
          backgroundColor: `hsla(${index * 36}, 70%, 50%, 0.1)`,
          fill: true,
          tension: 0.4
        }))
      };

      // Calculate distribution data
      const latestMeasurements = mockData.map(child => {
        const lastMeasurement = child.measurements[child.measurements.length - 1];
        return selectedMetric === 'height' ? lastMeasurement.height : lastMeasurement.weight;
      });

      const bins = 10;
      const min = Math.min(...latestMeasurements);
      const max = Math.max(...latestMeasurements);
      const binSize = (max - min) / bins;
      
      const distribution = Array(bins).fill(0);
      latestMeasurements.forEach(value => {
        const binIndex = Math.min(Math.floor((value - min) / binSize), bins - 1);
        distribution[binIndex]++;
      });

      const distributionChartData = {
        labels: Array(bins).fill(0).map((_, i) => 
          `${(min + i * binSize).toFixed(1)}-${(min + (i + 1) * binSize).toFixed(1)}`
        ),
        datasets: [{
          label: `${selectedMetric === 'height' ? 'Height' : 'Weight'} Distribution`,
          data: distribution,
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          borderColor: 'rgb(54, 162, 235)',
          borderWidth: 1
        }]
      };

      setChartData(processedData);
      setDistributionData(distributionChartData);
    } catch (error) {
      console.error('Error processing data:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedMetric, timeRange]);

  const trendOptions = {
    ...defaultChartOptions,
    scales: {
      ...defaultChartOptions.scales,
      y: {
        ...defaultChartOptions.scales?.y,
        title: {
          display: true,
          text: selectedMetric === 'height' ? 'Height (cm)' : 'Weight (kg)'
        }
      }
    }
  };

  const distributionOptions = {
    ...defaultChartOptions,
    scales: {
      ...defaultChartOptions.scales,
      y: {
        ...defaultChartOptions.scales?.y,
        title: {
          display: true,
          text: 'Number of Children'
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 mb-8"></div>
          <div className="h-[400px] bg-gray-100 rounded-xl mb-8"></div>
          <div className="h-[300px] bg-gray-100 rounded-xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Growth Trends Analysis</h1>
        <p className="text-gray-600">
          Analyze growth patterns and distributions across the population
        </p>
      </div>

      {/* Controls */}
      <div className="flex gap-4 mb-8">
        <select
          value={selectedMetric}
          onChange={(e) => setSelectedMetric(e.target.value as MetricType)}
          className="rounded-lg border-gray-300 shadow-sm"
        >
          <option value="height">Height</option>
          <option value="weight">Weight</option>
        </select>

        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value as TimeRange)}
          className="rounded-lg border-gray-300 shadow-sm"
        >
          <option value="6m">Last 6 Months</option>
          <option value="1y">Last 1 Year</option>
          <option value="2y">Last 2 Years</option>
          <option value="all">All Time</option>
        </select>
      </div>

      {/* Growth Trends Chart */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <h2 className="text-xl font-semibold mb-6">Individual Growth Trends</h2>
        <div className="h-[400px]">
          {chartData && (
            <Line 
              key={`trends-${selectedMetric}`}
              data={chartData} 
              options={trendOptions}
            />
          )}
        </div>
      </div>

      {/* Distribution Chart */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-6">Population Distribution</h2>
        <div className="h-[300px]">
          {distributionData && (
            <Bar 
              key={`distribution-${selectedMetric}`}
              data={distributionData} 
              options={distributionOptions}
            />
          )}
        </div>
      </div>
    </div>
  );
}
