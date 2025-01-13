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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Growth Trends Analysis</h1>
          <p className="mt-2 text-gray-600">Analyze growth patterns and distributions across the population</p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Metric</label>
              <select
                value={selectedMetric}
                onChange={(e) => setSelectedMetric(e.target.value as MetricType)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="height">Height</option>
                <option value="weight">Weight</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Time Range</label>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as TimeRange)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="6m">Last 6 months</option>
                <option value="1y">Last 1 year</option>
                <option value="2y">Last 2 years</option>
                <option value="all">All time</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : (
          <>
            {/* Growth Trends Chart */}
            <div className="bg-white rounded-lg shadow p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4">Growth Trends</h2>
              <div className="h-[400px]">
                {chartData && <Line data={chartData} options={trendOptions} />}
              </div>
            </div>

            {/* Distribution Chart */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Distribution Analysis</h2>
              <div className="h-[400px]">
                {distributionData && <Bar data={distributionData} options={distributionOptions} />}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
