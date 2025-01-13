import React from 'react';
import Layout from '../components/layout/Layout';
import Image from 'next/image';

const Documentation = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">Understanding Growth Monitoring & Impact</h1>

        {/* WHO Standards Section */}
        <section className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">WHO Growth Standards</h2>
          <div className="prose max-w-none">
            <p className="mb-4">
              Our platform uses the WHO Child Growth Standards, which describe normal child growth from birth to 5 years. These standards show how children should grow under optimal conditions.
            </p>
            
            <h3 className="text-xl font-semibold mt-6 mb-3">Key Measurements</h3>
            <ul className="list-disc list-inside space-y-2 mb-4">
              <li>
                <span className="font-medium">Height-for-Age (HFA):</span> Indicates stunting and chronic malnutrition
              </li>
              <li>
                <span className="font-medium">Weight-for-Age (WFA):</span> Indicates underweight and general nutrition status
              </li>
              <li>
                <span className="font-medium">Weight-for-Height (WFH):</span> Indicates wasting and acute malnutrition
              </li>
            </ul>

            <h3 className="text-xl font-semibold mt-6 mb-3">Understanding Z-Scores</h3>
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <p className="mb-2">Z-scores indicate how far a child's measurement is from the median:</p>
              <ul className="list-disc list-inside space-y-2">
                <li>Above +2: Potentially overweight/tall</li>
                <li>Between +2 and -2: Normal range</li>
                <li>Below -2: Moderate malnutrition/stunting</li>
                <li>Below -3: Severe malnutrition/stunting</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Growth Charts Explanation */}
        <section className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Reading Growth Charts</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-3">Chart Components</h3>
              <ul className="list-disc list-inside space-y-2">
                <li>
                  <span className="font-medium">Solid Blue Line:</span> Child's actual growth trajectory
                </li>
                <li>
                  <span className="font-medium">Dashed Black Line:</span> WHO median (50th percentile)
                </li>
                <li>
                  <span className="font-medium">Dashed Red Lines:</span> ±2 SD (Standard Deviation) boundaries
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3">Interpreting Trends</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-medium text-green-800 mb-2">Positive Indicators</h4>
                  <ul className="list-disc list-inside text-green-700">
                    <li>Consistent upward trajectory</li>
                    <li>Parallel to reference lines</li>
                    <li>Movement toward median</li>
                  </ul>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <h4 className="font-medium text-red-800 mb-2">Warning Signs</h4>
                  <ul className="list-disc list-inside text-red-700">
                    <li>Flattening growth curve</li>
                    <li>Crossing percentile lines downward</li>
                    <li>Sharp changes in trajectory</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Impact Calculation */}
        <section className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Measuring Program Impact</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-3">Individual Impact</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="mb-2">We calculate individual impact using:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Change in z-scores over time</li>
                  <li>Velocity of growth (rate of change)</li>
                  <li>Recovery from malnutrition states</li>
                </ul>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3">Program-Level Impact</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Key Metrics</h4>
                  <ul className="list-disc list-inside space-y-1">
                    <li>% of children showing improvement</li>
                    <li>Average z-score change</li>
                    <li>Recovery rates</li>
                    <li>Intervention effectiveness</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Statistical Analysis</h4>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Population-level trends</li>
                    <li>Intervention correlation</li>
                    <li>Growth velocity analysis</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3">Impact Score Calculation</h3>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="mb-2">Our impact score (0-100) considers:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>40%: Average improvement in z-scores</li>
                  <li>30%: % of children showing positive growth velocity</li>
                  <li>20%: Intervention completion rate</li>
                  <li>10%: Follow-up adherence</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Data Quality Section */}
        <section className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Ensuring Data Quality</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-semibold mb-3">Data Validation</h3>
              <ul className="list-disc list-inside space-y-2">
                <li>Automatic detection of implausible measurements</li>
                <li>Cross-validation between different metrics</li>
                <li>Historical trend analysis</li>
                <li>Regular calibration checks</li>
              </ul>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Best Practices for Data Collection</h3>
              <ul className="list-disc list-inside space-y-2">
                <li>Regular measurement intervals (monthly recommended)</li>
                <li>Consistent measurement techniques</li>
                <li>Proper equipment calibration</li>
                <li>Complete documentation of interventions</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Documentation;
