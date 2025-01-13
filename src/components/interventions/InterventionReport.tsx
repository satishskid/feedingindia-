import React from 'react';
import {
  calculateGrowthVelocity,
  calculateWHOZScore,
  calculatePercentile,
  calculateEffectSize,
  tTest,
} from '../../utils/statistics';
import { Intervention, GrowthMeasurement } from '../../types/interventions';

interface InterventionReportProps {
  intervention: Intervention;
  measurements: GrowthMeasurement[];
  whoStandards: any; // Replace with proper WHO standards type
  onExport?: () => void;
}

export default function InterventionReport({
  intervention,
  measurements,
  whoStandards,
  onExport,
}: InterventionReportProps) {
  const startDate = new Date(intervention.startDate);
  const endDate = new Date(intervention.endDate);

  // Split measurements into periods
  const preMeasurements = measurements.filter(m => new Date(m.date) < startDate);
  const duringMeasurements = measurements.filter(
    m => {
      const date = new Date(m.date);
      return date >= startDate && date <= endDate;
    }
  );
  const postMeasurements = measurements.filter(m => new Date(m.date) > endDate);

  // Calculate statistics
  const heightVelocities = {
    pre: calculateGrowthVelocity(preMeasurements, 'height'),
    during: calculateGrowthVelocity(duringMeasurements, 'height'),
    post: calculateGrowthVelocity(postMeasurements, 'height'),
  };

  const weightVelocities = {
    pre: calculateGrowthVelocity(preMeasurements, 'weight'),
    during: calculateGrowthVelocity(duringMeasurements, 'weight'),
    post: calculateGrowthVelocity(postMeasurements, 'weight'),
  };

  const heightStats = tTest(
    preMeasurements.map(m => m.height),
    duringMeasurements.map(m => m.height)
  );

  const weightStats = tTest(
    preMeasurements.map(m => m.weight),
    duringMeasurements.map(m => m.weight)
  );

  const heightEffect = calculateEffectSize(
    preMeasurements.map(m => m.height),
    duringMeasurements.map(m => m.height)
  );

  const weightEffect = calculateEffectSize(
    preMeasurements.map(m => m.weight),
    duringMeasurements.map(m => m.weight)
  );

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Report Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Intervention Impact Report</h2>
          {onExport && (
            <button
              onClick={onExport}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
            >
              Export Report
            </button>
          )}
        </div>
      </div>

      {/* Report Content */}
      <div className="p-6 space-y-8">
        {/* Intervention Details */}
        <section>
          <h3 className="text-lg font-semibold mb-4">Intervention Details</h3>
          <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
            <div>
              <p className="text-sm text-gray-500">Type</p>
              <p className="font-medium">{intervention.type}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <p className="font-medium">{intervention.status}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Start Date</p>
              <p className="font-medium">{formatDate(startDate)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">End Date</p>
              <p className="font-medium">{formatDate(endDate)}</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm text-gray-500">Description</p>
              <p className="font-medium">{intervention.description}</p>
            </div>
          </div>
        </section>

        {/* Growth Velocity Analysis */}
        <section>
          <h3 className="text-lg font-semibold mb-4">Growth Velocity Analysis</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Height Velocity */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-3">Height Velocity (cm/month)</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">Pre-intervention:</span>
                  <span className="font-medium">{heightVelocities.pre.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">During intervention:</span>
                  <span className="font-medium">{heightVelocities.during.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Post-intervention:</span>
                  <span className="font-medium">{heightVelocities.post.toFixed(2)}</span>
                </div>
                <div className="pt-2 border-t border-gray-200">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Change during intervention:</span>
                    <span className={`font-medium ${heightVelocities.during > heightVelocities.pre ? 'text-green-600' : 'text-red-600'}`}>
                      {((heightVelocities.during - heightVelocities.pre) / heightVelocities.pre * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Weight Velocity */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-3">Weight Velocity (kg/month)</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">Pre-intervention:</span>
                  <span className="font-medium">{weightVelocities.pre.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">During intervention:</span>
                  <span className="font-medium">{weightVelocities.during.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Post-intervention:</span>
                  <span className="font-medium">{weightVelocities.post.toFixed(2)}</span>
                </div>
                <div className="pt-2 border-t border-gray-200">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Change during intervention:</span>
                    <span className={`font-medium ${weightVelocities.during > weightVelocities.pre ? 'text-green-600' : 'text-red-600'}`}>
                      {((weightVelocities.during - weightVelocities.pre) / weightVelocities.pre * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Statistical Analysis */}
        <section>
          <h3 className="text-lg font-semibold mb-4">Statistical Analysis</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Height Statistics */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-3">Height Analysis</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">t-value:</span>
                  <span className="font-medium">{heightStats.tValue.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">p-value:</span>
                  <span className="font-medium">{heightStats.pValue.toFixed(4)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Statistical Significance:</span>
                  <span className={`font-medium ${heightStats.significant ? 'text-green-600' : 'text-gray-600'}`}>
                    {heightStats.significant ? 'Significant' : 'Not Significant'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Effect Size:</span>
                  <span className="font-medium">{heightEffect.cohensD.toFixed(2)} ({heightEffect.interpretation})</span>
                </div>
              </div>
            </div>

            {/* Weight Statistics */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-3">Weight Analysis</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">t-value:</span>
                  <span className="font-medium">{weightStats.tValue.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">p-value:</span>
                  <span className="font-medium">{weightStats.pValue.toFixed(4)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Statistical Significance:</span>
                  <span className={`font-medium ${weightStats.significant ? 'text-green-600' : 'text-gray-600'}`}>
                    {weightStats.significant ? 'Significant' : 'Not Significant'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Effect Size:</span>
                  <span className="font-medium">{weightEffect.cohensD.toFixed(2)} ({weightEffect.interpretation})</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Clinical Interpretation */}
        <section>
          <h3 className="text-lg font-semibold mb-4">Clinical Interpretation</h3>
          <div className="bg-gray-50 p-4 rounded-lg space-y-4">
            <div>
              <h4 className="font-medium mb-2">Height Growth</h4>
              <p className="text-gray-700">
                {heightStats.significant
                  ? `The intervention had a statistically significant impact on height growth (p=${heightStats.pValue.toFixed(4)}). `
                  : 'The intervention did not show a statistically significant impact on height growth. '}
                The effect size was {heightEffect.interpretation} (d={heightEffect.cohensD.toFixed(2)}). 
                Growth velocity {heightVelocities.during > heightVelocities.pre ? 'increased' : 'decreased'} by 
                {Math.abs((heightVelocities.during - heightVelocities.pre) / heightVelocities.pre * 100).toFixed(1)}% 
                during the intervention period.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Weight Growth</h4>
              <p className="text-gray-700">
                {weightStats.significant
                  ? `The intervention had a statistically significant impact on weight gain (p=${weightStats.pValue.toFixed(4)}). `
                  : 'The intervention did not show a statistically significant impact on weight gain. '}
                The effect size was {weightEffect.interpretation} (d={weightEffect.cohensD.toFixed(2)}). 
                Weight gain velocity {weightVelocities.during > weightVelocities.pre ? 'increased' : 'decreased'} by 
                {Math.abs((weightVelocities.during - weightVelocities.pre) / weightVelocities.pre * 100).toFixed(1)}% 
                during the intervention period.
              </p>
            </div>

            <div>
              <h4 className="font-medium mb-2">Overall Assessment</h4>
              <p className="text-gray-700">
                {(heightStats.significant || weightStats.significant) 
                  ? 'The intervention showed positive results in ' +
                    (heightStats.significant && weightStats.significant 
                      ? 'both height and weight growth.' 
                      : heightStats.significant 
                        ? 'height growth.' 
                        : 'weight gain.')
                  : 'The intervention did not show statistically significant results in either height or weight growth.'}
                {' '}
                {(heightEffect.cohensD > 0.5 || weightEffect.cohensD > 0.5) &&
                  'The intervention demonstrated a substantial clinical effect, suggesting meaningful growth improvements.'}
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
