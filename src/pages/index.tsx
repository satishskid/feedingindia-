import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { FaUsers, FaRulerVertical, FaWeight, FaClock } from 'react-icons/fa';
import Link from 'next/link';
import { generateMockChildren } from '../data/mockChildrenData';
import { defaultChartOptions } from '../utils/chartConfig';
import '../utils/chartConfig';  // Import for side effects (Chart.js registration)

// Mock programs data
const mockPrograms = [
  { id: 'prog1', name: 'Nutrition Program 2024' },
  { id: 'prog2', name: 'School Health Initiative' },
  { id: 'prog3', name: 'Community Wellness Program' },
];

export default function Home() {
  const [selectedProgram, setSelectedProgram] = useState(mockPrograms[0].id);
  const [data, setData] = useState({
    children: [],
    stats: {
      totalChildren: 0,
      avgHeight: 0,
      avgWeight: 0
    },
    chartData: {
      labels: [],
      datasets: []
    }
  });

  useEffect(() => {
    const mockData = generateMockChildren();
    const programData = mockData.filter(child => child.programId === selectedProgram);
    
    // Calculate summary statistics
    const totalChildren = programData.length;
    const avgHeight = Math.round(programData.reduce((sum, child) => 
      sum + child.measurements[child.measurements.length - 1].height, 0) / totalChildren);
    const avgWeight = (programData.reduce((sum, child) => 
      sum + child.measurements[child.measurements.length - 1].weight, 0) / totalChildren).toFixed(1);

    // Sample data for the chart
    const sampleChildren = programData.slice(0, 3);
    const chartData = {
      labels: ['0m', '6m', '12m', '18m', '24m'],
      datasets: sampleChildren.map((child, index) => ({
        label: child.name,
        data: child.measurements.map(m => m.height),
        borderColor: ['#00bcd4', '#ff4081', '#4caf50'][index],
        backgroundColor: ['rgba(0,188,212,0.1)', 'rgba(255,64,129,0.1)', 'rgba(76,175,80,0.1)'][index],
        fill: true,
        tension: 0.4
      }))
    };

    setData({
      children: mockData,
      stats: {
        totalChildren,
        avgHeight,
        avgWeight
      },
      chartData
    });
  }, [selectedProgram]);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 mb-8 text-white">
        <h1 className="text-3xl font-bold mb-4">Child Growth Monitor</h1>
        <p className="text-lg opacity-90">
          Track and monitor children's growth with WHO standards. Make data-driven decisions for better health outcomes.
        </p>
      </div>

      {/* Program Selector */}
      <div className="mb-8 bg-white p-6 rounded-lg shadow">
        <label htmlFor="program" className="block text-sm font-medium text-gray-700 mb-2">
          Select Program
        </label>
        <select
          id="program"
          value={selectedProgram}
          onChange={(e) => setSelectedProgram(e.target.value)}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          {mockPrograms.map(program => (
            <option key={program.id} value={program.id}>
              {program.name}
            </option>
          ))}
        </select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 flex items-center">
          <FaUsers className="h-10 w-10 text-blue-500" />
          <div className="ml-4">
            <p className="text-sm text-gray-600">Total Children</p>
            <p className="text-2xl font-semibold">{data.stats.totalChildren}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 flex items-center">
          <FaRulerVertical className="h-10 w-10 text-green-500" />
          <div className="ml-4">
            <p className="text-sm text-gray-600">Average Height</p>
            <p className="text-2xl font-semibold">{data.stats.avgHeight} cm</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 flex items-center">
          <FaWeight className="h-10 w-10 text-purple-500" />
          <div className="ml-4">
            <p className="text-sm text-gray-600">Average Weight</p>
            <p className="text-2xl font-semibold">{data.stats.avgWeight} kg</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 flex items-center">
          <FaClock className="h-10 w-10 text-orange-500" />
          <div className="ml-4">
            <p className="text-sm text-gray-600">Last Updated</p>
            <p className="text-2xl font-semibold">Today</p>
          </div>
        </div>
      </div>

      {/* Growth Chart */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Recent Growth Trends</h2>
          <Link 
            href="/analysis/trends" 
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            View All Charts →
          </Link>
        </div>
        <div className="h-[300px]">
          {data.chartData.datasets.length > 0 && (
            <Line 
              key="growth-chart"
              data={data.chartData} 
              options={defaultChartOptions} 
            />
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link href="/data-entry"
          className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
          <h3 className="text-lg font-semibold mb-2">Add New Data</h3>
          <p className="text-gray-600">Record new measurements and interventions</p>
        </Link>
        <Link href="/analysis/population"
          className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
          <h3 className="text-lg font-semibold mb-2">Population Analysis</h3>
          <p className="text-gray-600">View statistics and growth patterns</p>
        </Link>
        <Link href="/visualizations"
          className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
          <h3 className="text-lg font-semibold mb-2">WHO Standards</h3>
          <p className="text-gray-600">Compare with WHO growth standards</p>
        </Link>
      </div>
    </div>
  );
}
